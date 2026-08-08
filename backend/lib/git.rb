=begin

Pour toutes les opérations Git

Toutes ces fonctions sont appelées par :
  - l'action 'git-ope' 
  - les arguments git_args (array)
  - le chemin du projet 'project_path'

Toutes les fonctions ont en premier argument le chemin d'accès
au fichier.
=end
require_relative 'usefull.rb'
require 'shellwords'

class Git
class << self



  # Initier git pour le projet donné
  def init_for_project(project_path, github_account, github_name, labels)
    
    retour = {
      ok: true,
      error: nil,
      message: nil,
      labels: labels
    }
    
    begin
      # Primo vérification (il ne faut pas que git soit déjà installé)
      if git_exist_for_project?(project_path)
        retour[:error] = ['backend-already-git']
      else
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

  # Commit des fichiers avec un message
  def commit(project_path:, files:, message:)
    unless git_exist_for_project?(project_path)
      RETOUR.error ['backend-not-a-git-folder', project_path]
      return
    end
    files = JSON.parse(files)
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
  def get_status_files(path)
    longuest_name = 0
    longuest_path = 0
    res = `cd "#{path}" && git status -s`
      .split("\n")
      .map do |file|
        mark = file[0..1].strip
        path = file[3..-1]
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
        [path, "<span title='#{original_name}'>#{name}</span> <span title='#{original_folder}'>#{folder}</span> (#{mark})"]
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
end #/Git