=begin

Module ruby pour gérer les PR Github

=end
require_relative './lib/utils.rb'
require_relative '../lib/git.rb'
require_relative '../lib/syntax_checker.rb'

ARGS = ARGV.clone
PROJECT_PATH    = ARGS.shift # ARGV[0]
PR_CYCLE_PHASE  = ARGS.shift # ARGV[1]
GIT = Git.new(PROJECT_PATH)

class PRCycle 
class << self
  
  def err(content)
    retour[:error] = content
    retour[:ok] = false
    false
  end

  # Initialisation du cycle
  # -----------------------
  # Git doit être installé
  # Il doit partir d'une branche main clean sans aucun fichier modifié
  def exec_init
    retour[:message] += "/initier dans #{PROJECT_PATH}"
    _project_is_clean_for_init_pr_cycle? || return
    # On peut initier le Cycle PR
    branche = ARGS.shift
    cmd = <<~BASH
    cd "#{PROJECT_PATH}"
    git checkout -b #{branche}
    BASH
    retour[:git_command] = cmd
    res = `#{cmd}` # protection ou erreur impossible après vérifications précédentes ?
    retour[:git_response] = res
    retour[:message] = ['github-pr-cycle-inited', PROJECT_PATH]
    return retour
  end
  
  # Commit des fichiers développés
  # ------------------------------
  # 2e phase du Github PR Cycle, on commit des fichiers à transmettre
  # En plus du simple commit, le programme fait des vérifications
  # basiques de syntaxe avec `ruby -c`, `node --check`, etc.
  def exec_commit
    branch_name     = ARGS.shift
    commit_message  = ARGS.shift
    retour[:message] += "/commiter dans #{PROJECT_PATH}, branche #{branch_name}"
    # S'assurer d'abord qu'on est sur la bonne branche
    unless GIT.branch?(branch_name)
      retour[:ok] = true
      retour[:error] = ['git-bad-branch', branch_name]
      return retour
    end
    # Prendre les fichiers commitables
    files   = GIT.get_commitable_files
    # => liste de hash {:path, :state[, :error]}
    # => on ne prend que les fichiers modifiés ou nouveau
    files_with_git_conflict = []
    files_with_syntax_error = []
    files_with_no_syn_error = []
    files_not_checked_byext = []
    files_deleted           = []
    files.each do |dfile|
      if dfile[:error]
        files_with_git_conflict << dfile
      elsif dfile[:state] == 'D'
        files_deleted << dfile
      else
        case error = SyntaxChecker.check_file(File.join(PROJECT_PATH, dfile[:path]), true)
        when nil
          files_with_no_syn_error << dfile
        when :ok
          files_not_checked_byext << dfile
        else
          dfile[:error] = error
          files_with_syntax_error << dfile
        end
      end
    end
    if files_with_syntax_error.empty? && files_with_git_conflict.empty?
      # On peut commiter
      relpath_list = (files_with_no_syn_error + files_not_checked_byext + files_deleted).map { |dfile| dfile[:path] }
      res = GIT.commit_files(relpath_list, commit_message)
      unless res.nil?
        retour[:error] = res
      end
    else
      retour[:ok] = true # no raise, pour traiter l'erreur dans la fonction
      retour[:error] = {syntax: files_with_syntax_error, conflict: files_with_git_conflict}
    end
    return retour
  end
  
  def exec_submit
    retour[:message] += "/submit dans #{PROJECT_PATH}"

    return retour
  end


  ### Sous-méthodes utiles

  # @return true si le projet est bon candidat pour un cycle
  # PR Github
  def _project_is_clean_for_init_pr_cycle?
    unless GIT.installed?
      return err(['backend-not-a-git-repo', PROJECT_PATH])
    end
    if (ret = GIT.status_clean?) === true
      return true
    else
      return err(ret)
    end
  end


  ### Propriétés de l'instance

  def phase
    PR_CYCLE_PHASE
  end

  def retour
    @retour ||= begin
      inited_table.tap { |t| t[:message] = "Github PR Cycle - Phase #{phase}" }
    end
  end

end # /<< self
end #/PRCycle


PRCycle.send("exec_#{PR_CYCLE_PHASE}".to_sym)

puts PRCycle.retour.to_json