=begin

Module ruby pour gérer les PR Github

=end
require_relative './lib/utils.rb'
require_relative '../lib/git.rb'

ARGS = ARGV.clone
PROJECT_PATH    = ARGS.shift # ARGV[0]
PR_CYCLE_PHASE  = ARGS.shift # ARGV[1]
# ARG1            = ARGV[2]
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
    retour[:command] = cmd
    res = `#{cmd}` # protection ou erreur impossible après vérifications précédentes ?
    retour[:res_command] = res
    retour[:message] = ['github-pr-cycle-inited', PROJECT_PATH]
  end
  
  def exec_commit
    retour[:message] += "/commiter dans #{PROJECT_PATH}"
  end
  
  def exec_submit
    retour[:message] += "/submit dans #{PROJECT_PATH}"
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