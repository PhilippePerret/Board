# Test : dynParam 'branche-name' (github-pr-cycle-init), propriété
# :validIf — une valeur invalide (espaces/majuscules) doit rouvrir le MÊME
# dialogue avec un message d'erreur, pas avancer ni planter. Une valeur
# valide ensuite doit continuer normalement.
#
# Couvre 2 fix : Prompter#promptString (validIf n'était consulté nulle
# part) et ServiceData.js (validIf était `(v) => {v.match(...)}`, un corps
# de bloc qui ne retournait jamais rien — toujours invalide en pratique).

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'github-pr-cycle-init'

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet PR Cycle ValidIf', path: fixture_dir)
    launch_app

    card = "project-#{id}"
    wait_for(card)
    click(card)
    wait_for(SERVICE_DOM_ID)

    click(SERVICE_DOM_ID)
    wait_for_suffix('btn-oui')
    click_suffix('btn-oui') # confirm_init accepté

    wait_for('__branche-name__')
    set_value('__branche-name__', 'Ma Branche Invalide !')
    click_suffix('btn-oui')

    # → même dialogue réaffiché, avec un message d'erreur
    wait_until(desc: -> { "dialog_error_text = #{(dialog_error_text rescue '(erreur)').inspect}" }) do
      (dialog_error_text rescue '') =~ /invalide/i
    end
    raise "le champ du nom de branche devrait être encore là après une valeur invalide" unless exists?('__branche-name__')

    # → une valeur valide doit continuer normalement
    set_value('__branche-name__', 'ma-branche-valide')
    click_suffix('btn-oui')

    wait_until(desc: -> { "popup erreur = #{(errors_dialog_text rescue '(aucune)').inspect}" }) do
      (errors_dialog_text rescue '') =~ /pas un repo Git/
    end
  end
ensure
  remove_fixture_project(id) if id
end

board_test("github-pr-cycle-init : validIf rejette une branche invalide, réaffiche le dialogue avec erreur") { run_test }
