=begin

Pour toutes les opérations Git

Toutes ces fonctions sont appelées par :
  - l'action 'git-ope' 
  - les arguments git_args (array)
  - le chemin du projet 'project_path'

Toutes les fonctions ont en premier argument le chemin d'accès
au fichier.
=end
require 'timeout'
require 'shellwords'
require_relative 'usefull.rb'

class TimeoutError < StandardError; end

GIT_CONFLICT_PREFIX = {
  'AA' => 'git-status-added-both-sides',
  'DD' => 'git-status-deleted-both-sides',
  'UU' => 'git-status-modified-both-sides',
  'AU' => 'git-status-add-and-absent',
  'UA' => 'git-status-absent-and-add',
  'DU' => 'git-status-deleted-and-modified',
  'UD' => 'git-status-modified-and-deleted'
}

class Git

  attr_reader :project_path

  # Exécution du code +cmd+. Return nil en cas de succès ou 
  # l'erreur +err+ (errId qui doit recevoir res en valeur)
  def _exec(cmd, err)
    res = `#{cmd}`
    if $?.success?
      nil
    else
      [err, res]
    end
  end

  def initialize(project_path)
    @project_path = project_path
  end

  def installed?
    File.exist?(File.join(project_path, '.git'))
  end

  # @return true si le status de Git est clean, donc sans rien à 
  # commiter
  def status_clean?
    return `cd "#{project_path}" && git status -s`.split("\n").count == 0
  end

  # Return true si on se trouve sur la branche +branch_name+
  def on_branch?(branch_name)
    res = `cd "#{project_path}" && git status -s --branch`
    first_line = res.split("\n").first
    return false if first_line.nil?
    !!first_line.strip.match?(/\A## #{Regexp.escape(branch_name)}(\.\.\.|\z| )/)
  end

  # Return true si la branche +branch_name+ existe ?
  def branch?(branch_name)
    res = `
    exec 2>&1
    cd "#{project_path}" && git branch
    `
    if $?.success?
      res.strip.split("\n").map do |line|
        branche = line.gsub(/(\* )/, '').strip
        return true if branche == branch_name
      end
      return false
    else
      return 'git-error-reading-branch'
    end
  end

  # Commit les fichiers de la liste +relpaths+ [Array] 
  # Note : ces fichiers ont été testés pour être valides
  def commit_files(relpaths, message)
    cmd = <<~ZSH
    exec 2>&1
    cd #{Shellwords.escape(project_path)}
    git add #{relpaths.map{|p| Shellwords.escape(p)}.join(' ')}
    git commit -m #{Shellwords.escape(message)}
    ZSH
    return _exec(cmd, 'git-commit-error') # nil ou l'erreur
  end

  # @return la liste des fichiers à commiter
  # @param smart_list:  Si true (defaut) retourne une liste d'objets
  #   définissant {path:, state: 'M|D|R|C'}
  #           ou {path:, error:} en cas de conflit
  #   A=ajouté M= modification, D= délétion, R= renommage, C= création
  def get_commitable_files
    res = `cd "#{project_path}" && git -c core.precomposeUnicode=true -c core.quotePath=false status -s`
    cfiles = res.split("\n").map do |line|
      oper = line[0..2].strip
      path = line[3..-1].strip.gsub(/"/, '')
      if GIT_CONFLICT_PREFIX[oper]
        {path: path, error: GIT_CONFLICT_PREFIX[oper]}
      else
        oper = oper[0]
        oper = case oper[0]
        when '?' then 'C'
        when 'R' then 
          path = path.split(' -> ')[1].strip.gsub(/"/, '')
          'R'
        else oper[0]
        end
        {path: path, state: oper}
      end
    end
    cfiles
  end

  # Destruction d'une branche
  def destroy_branch(branch_name)
    cmd = <<~ZSH
    exec 2>&1
    cd #{Shellwords.escape(project_path)}
    git branch -D #{branch_name}
    ZSH
    return _exec(cmd, 'git-unable-destroy-branch')
  end

  def push_branch(branch_name)
    cmd = <<~ZSH
    exec 2>&1
    cd #{Shellwords.escape(project_path)}
    git push -u origin #{branch_name}
    ZSH
    return _exec(cmd, 'git-push-error')
  end

  def create_pull_request()
    cmd = <<~ZSH
    exec 2>&1
    cd #{Shellwords.escape(project_path)}
    gh pr create --fill
    ZSH
    return _exec(cmd, 'git-pr-create-error')
  end

  # Méthode qui attend les résultats pour une PR soumise
  def wait_for_pr_checks
    begin
      Timeout.timeout(45, TimeoutError, 'git-pr-checks-timeout') do
        cmd = <<~ZSH
        exec 2>&1
        cd #{Shellwords.escape(project_path)}
        gh pr checks --fail-fast --watch --interval 3
        ZSH
        res = `#{cmd}`
        case $?.exitstatus
        when 0 then return nil # tout ok
        when 1 then return 'git-pr-waiting-checks-failure'
        else        return ['git-pr-waiting-checks-error', res]
        end
      end
    rescue TimeoutError => e
      return e.message
    end
  end

  # Pour revenir à la branche principale
  def back_to_main_branch
    cmd = <<~ZSH
    exec 2>&1
    cd #{Shellwords.escape(project_path)}
    git checkout main
    ZSH
    return _exec(cmd, 'git-unable-checkout-main')
  end
  
  def merge_pull_request
    cmd = <<~ZSH
    exec 2>&1
    cd #{Shellwords.escape(project_path)}
    gh pr merge --squash --delete-branch
    ZSH
    return _exec(cmd, 'git-unable-pr-merge')
  end
  
  def pull_on_main
    cmd = <<~ZSH
    exec 2>&1
    cd #{Shellwords.escape(project_path)}
    git pull
    ZSH
    return _exec(cmd, 'git-unable-pr-merge')
  end


#################### C L A S S E #####################

class << self



  # Interroge Github pour savoir si le dépôt <github_account>/<github_name>
  # existe déjà, et si oui, s'il est vide et si on a les droits de push.
  # @return {ok:, exists:, error:} — error non nil bloque l'initialisation
  # (droits insuffisants ou dépôt déjà occupé) même si ok est true (ce n'est
  # pas une erreur technique, juste un état qui interdit de poursuivre).
  def check_remote_repo(github_account, github_project_name)
    slug = "#{github_account}/#{github_project_name}"
    if ENV['APP_BOARD_TESTS_RUNNING'] && ENV['BOARD_TEST_GIT_REMOTE']
      # Tests : le remote est un dépôt bare LOCAL (git_e2e_stub.rb), jamais
      # interrogé via `gh` — toujours considéré existant, vide, disponible.
      return {ok: true, exists: true, error: nil}
    end
    out = `gh api repos/#{Shellwords.escape(slug)} 2>&1`
    if $?.success?
      data = JSON.parse(out)
      return {ok: true, exists: true, error: ['git-init-no-push-permission', slug]} unless data.dig('permissions', 'push')
      return {ok: true, exists: true, error: ['git-init-repo-exists-not-empty', slug]} unless data['size'].to_i == 0
      {ok: true, exists: true, error: nil}
    elsif out.include?('HTTP 404')
      {ok: true, exists: false, error: nil}
    else
      {ok: false, exists: nil, error: ['backend-github-api-error', out]}
    end
  rescue JSON::ParserError => e
    {ok: false, exists: nil, error: ['backend-github-api-error', e.message]}
  end

  # Crée le dépôt Github <github_account>/<github_name>, avec la visibilité
  # demandée ('private' par défaut).
  def create_remote_repo(github_account, github_project_name, visibility, description = nil)
    slug = "#{github_account}/#{github_project_name}"
    vis_flag = visibility == 'public' ? '--public' : '--private'
    desc_flag = description && !description.strip.empty? ? "--description #{Shellwords.escape(description)}" : ''
    out = `gh repo create #{Shellwords.escape(slug)} #{vis_flag} #{desc_flag} 2>&1`
    if $?.success?
      {ok: true}
    else
      {ok: false, error: ['backend-github-repo-create-error', out]}
    end
  end

  # Initier git pour le projet donné.
  # @param visibility  'private' ou 'public' — utilisé UNIQUEMENT si le
  #   dépôt distant n'existe pas encore (sinon ignoré, le dépôt existant
  #   garde sa visibilité actuelle).
  # @param description  description du dépôt Github — même règle que
  #   visibility : utilisée UNIQUEMENT à la création, ignorée sinon.
  def init_for_project(project_path, github_account, github_name, labels, visibility = nil, description = nil)

    retour = {
      ok: true,
      error: nil,
      message: nil,
      labels: labels
    }

    begin
      # Primo vérification (il ne faut pas que git soit déjà installé)
      if git_exist_for_project?(project_path)
        retour[:ok] = false
        retour[:error] = ['backend-already-git']
        return retour
      end

      # Le dépôt distant doit soit déjà exister (vide, droits ok), soit
      # être créé maintenant.
      status = check_remote_repo(github_account, github_name)
      unless status[:ok] && status[:error].nil?
        retour[:ok] = false
        retour[:error] = status[:error] || status
        return retour
      end
      unless status[:exists]
        create_res = create_remote_repo(github_account, github_name, visibility, description)
        unless create_res[:ok]
          retour[:ok] = false
          retour[:error] = create_res[:error]
          return retour
        end
      end

      # Initialisation dans le dossier
      res = git_init(project_path, github_account, github_name)
      retour.merge!(res)
      return retour if res[:ok] === false

      # Création des lables
      if labels.count > 0
        res_ope = update_labels(project_path: project_path, labels: labels.join(','))
        if (res_ope[:ok])
          msg = retour[:message]
          msg = [msg] if msg.is_a?(String)
          msg << 'backend-add-labels-ajout'
        else
          retour = res_ope
        end
      end
    rescue Exception => e
      retour[:ok] = false
      retour[:error] = e.message
    end
    return retour
  end

  # @return true si le dossier du projet est déjà gité
  def git_exist_for_project?(project_path)
    File.exist?(File.join(project_path, '.git'))
  end

  # Remonte la liste des issues correspondant au +label+
  def get_issues(project_path, labels)
    if labels.empty?
      _get_all_issues(project_path)
    else
      labels.map { |label| _get_issues_of_label(project_path, label )}.flatten
    end
  end

  # @return toutes les issues
  def _get_all_issues(project_path)
    cmd = <<~BASH
    exec 2>&1
    cd #{Shellwords.escape(project_path)}
    gh issue list --json number,title
    BASH
    begin
      res = `#{cmd}`
      JSON.parse(res)
    rescue Excpetion => e
      RETOUR.error e.message
      []
    end
  end

  # @return les issues d'un certain label
  def _get_issues_of_label(project_path, label)
    cmd = <<~BASH
    exec 2>&1
    cd #{Shellwords.escape(project_path)}
    gh issue list -l '#{label}' --json number,title
    BASH
    begin
      res = `#{cmd}`
      JSON.parse(res)
    rescue Excpetion => e
      RETOUR.error e.message
      []
    end
  end

  def update_labels(project_path:, labels:)
    # Première étape : récupérer les labels existants
    cmd = <<~BASH
    exec 2>&1
    cd #{Shellwords.escape(project_path)}
    gh label list --json name,color
    BASH
    res = `#{cmd}`
    return {ok: false, error: ['backend-unabled-labels', res]} unless $?.success?
    table = JSON.parse(res)
    actual_labels = table.map { |h| h['name'] }
    colors = table.map { |h| h['color'] }

    # Deuxième étape : détruire les labels existants
    if actual_labels.any?
      cmd = <<~BASH
      exec 2>&1
      cd #{Shellwords.escape(project_path)}
      for label in "#{actual_labels.join('" "')}" ; do
        gh label delete "$label" --yes
      done
      BASH
      res = `#{cmd}`
      return {ok: false, error: ['backend-unabled-to-destroy-labels', res]} unless $?.success?
    end

    # Troisième étape : créer les nouveaux labels
    labels = labels.split(',')
    requests = labels.map do |label|
      "gh label create #{Shellwords.escape(label)} --color #{colors.shift || '777777'}"
    end
    cmd = <<~BASH
    exec 2>&1
    cd #{Shellwords.escape(project_path)}
    #{requests.join("\n")}
    BASH
    res = `#{cmd}`
    if $?.success?
      return {ok: true, message: res}
    else
      return {ok: false, error: ['backend-unable-to-create-labels', res]}
    end
  end

  # @return true si +path+ est un fichier iCloud "dataless" (présent en
  # apparence mais contenu pas rapatrié en local — `ls -lO` affiche le
  # flag "dataless"). Une lecture d'un tel fichier renvoie 0 octet, ce
  # qui fait échouer `git add` silencieusement (short read).
  def dataless_file?(path)
    return false unless File.exist?(path)
    `ls -lO #{Shellwords.escape(path)}`.match?(/\bdataless\b/)
  end

  # Commit des fichiers avec un message
  def commit(project_path:, files:, message:)
    unless git_exist_for_project?(project_path)
      RETOUR.error ['backend-not-a-git-folder', project_path]
      return
    end
    files = JSON.parse(files)

    if files.any? { |f| dataless_file?(File.join(project_path, f)) }
      return {ok: false, error: ['backend-icloud-dataless-files']}
    end

    cmd = <<~BASH
    exec 2>&1
    cd #{Shellwords.escape(project_path)}
    git add #{files.map { |p| Shellwords.escape(p) }.join(' ')}
    git commit -m #{Shellwords.escape(message)}
    git push
    BASH
    res = `#{cmd}`
    if $?.success?
      res
    else
      RETOUR.error = res
    end
  end

  # Retourne la liste des labels Github du projet
  def get_labels(path)
    cmd = <<~BASH
    exec 2>&1
    cd "#{path}"
    gh label list --json name --jq '.[].name'
    BASH
    res = `#{cmd}`
    res.split("\n").join(',')
  end

  # Retourne les fichiers en cours de traitement
  def get_status_files(project_path)
    longuest_name = 0
    longuest_path = 0
    res = `cd "#{project_path}" && git -c core.quotePath=false status -s`
      .split("\n")
      .map do |file|
        mark = file[0..1].strip
        path = file[3..-1].strip.gsub(/\A"|"\z/, '')
        name = File.basename(path)
        folder = File.dirname(path)
        longuest_name = name.length if name.length < 21 && name.length > longuest_name
        longuest_path = path.length if path.length < 32 && path.length > longuest_path
        [mark, name, folder, path]
      end
      .map do |dfile|
        mark, name, folder, path = dfile
        mark = case mark
        when 'M'  then 'Mod'
        when '??' then 'New'
        when 'A'  then 'Add'
        when 'R'  then 'Del'
        else mark
        end
        original_name = name
        name = 
          if name.length > longuest_name
            name[0..longuest_name - 2] + ' …'
          else
            name.ljust(longuest_name, ' ')
          end
        original_folder = folder
        folder =
          if folder.length > longuest_path
            folder[0..longuest_path - 2] + ' …'
          else
            folder.ljust(longuest_path, ' ')
          end
        warn = dataless_file?(File.join(project_path, path)) ? " <span class='icloud-warn' title='Fichier iCloud non rapatrié en local — commiter ce fichier via le Terminal'>⚠️ iCloud</span>" : ''
        [path, "<span title='#{original_name}'>#{name}</span> <span title='#{original_folder}'>#{folder}</span> (#{mark})#{warn}"]
      end
  end





  def git_init(project_path, github_account, github_project_name)

    remote_git_path = 
      if ENV['APP_BOARD_TESTS_RUNNING'] # lors des tests
        remote_path = ENV['BOARD_TEST_GIT_REMOTE'] || begin
          return {ok: false, error: ['backend-remote-test-required']}
        end
      else
        "git@github.com:#{github_account}/#{github_project_name}.git"
      end

    gitignore_path = File.join(project_path, '.gitignore')
    gitignore_default_content = <<~GIT
    .DS_Store

    _dev/

    dev/

    tmp/

    temp/

    GIT

    # 2>&1 (pas 2>/dev/null) : une erreur doit être visible dans le retour,
    # pas avalée en silence — c'est justement ce qui masquait l'échec d'un
    # push vers un remote inexistant.
    run = -> (command) {
      full_command = "cd '#{project_path}' && git #{command} 2>&1"
      res = `#{full_command}`
      return {ok: false, error: ['backend-git-failed', [command, res]]} unless $?.success?
      {ok: true, message: res}
    }

    retour = {ok: true, message: nil, error: nil}

    begin
      res = run.call('init')
      return res unless res[:ok]

      # Création du fichier gitignore
      IO.write(gitignore_path, gitignore_default_content)

      res = run.call('add -A')
      return res unless res[:ok]
      res = run.call('commit -m "first commit"')
      return res unless res[:ok]
      res = run.call('branch -M main')
      return res unless res[:ok]
      res = run.call("remote add origin #{remote_git_path}")
      return res unless res[:ok]
      res = run.call('push -u origin main')
      return res unless res[:ok]

      retour[:message] = 'backend-git-ready'
    rescue Exception => e
      retour[:ok] = false
      retour[:error] = e.message
    end

    return retour
  end

end #/<< self



################## INSTANCE #############################
# Une instance est souvent le git d'un projet particulier
end #/Git