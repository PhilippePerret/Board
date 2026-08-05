# Test : service commun "update-documentation" — chemin d'ÉCHEC.
# ServiceData.js déclare un `onError` custom pour ce service : ErrorsDialog
# avec un bouton "Corriger" (getMsg('Correct')) censé relancer
# "edit-documentation" (Service.runService.bind(Service, 'edit-documentation')).
# Source : plan de tests Tests/_plan_tests_fonctionnalites.adoc (2026-08-05,
# section C point 12). service_commun_update_documentation.rb ne couvre que
# le chemin de succès (compilation asciidoctor OK).
#
# LIMITE CONNUE (pas testée ici, pas un bug de ce test) : Service.runService
# (frontend/js/Service.js) est actuellement un stub —
#   static runService(serviceId) { console.error(...); const serv = this.get(serviceId) }
# — il ne relance RIEN en pratique. Ce test vérifie donc seulement que
# l'ErrorsDialog s'affiche avec le bon titre/bouton (partie réellement
# câblée), pas que cliquer "Corriger" relance effectivement
# "edit-documentation".
#
# Échec provoqué par un .adoc avec un include vers un fichier inexistant
# (asciidoctor --failure-level=WARN, backend/scripts/UpdateDocumentation.rb,
# échoue de façon fiable dessus).

require_relative '../../support/helpers'

include BoardTest

SERVICE_DOM_ID = 'update-documentation'

def run_test
  id = nil
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    id = create_fixture_project(title: 'Projet A', path: fixture_dir)
    broken_adoc = File.join(fixture_dir, 'broken.adoc')
    File.write(broken_adoc, "= Titre\n\ninclude::fichier-inexistant.adoc[]\n")
    launch_app

    card = "project-#{id}"
    wait_for(card)
    click(card)

    # → le panneau des services communs s'ouvre automatiquement à la sélection
    wait_for(SERVICE_DOM_ID)
    click(SERVICE_DOM_ID)

    # → 1re définition : docu-main-file-adoc absent -> sélection Finder
    wait_for_suffix('btn-oui')
    with_finder_selection(broken_adoc) do
      click_suffix('btn-oui')
    end

    # → échec asciidoctor -> onError custom -> ErrorsDialog avec bouton "Corriger"
    wait_until(10, desc: -> { "texte ErrorsDialog = #{(errors_dialog_text rescue '(erreur)').inspect}" }) do
      !(errors_dialog_text rescue '').empty?
    end
    raise "ErrorsDialog sans mention d'erreur asciidoctor : #{errors_dialog_text.inspect}" unless
      errors_dialog_text =~ /ERROR|fichier-inexistant/i

    raise "bouton 'Corriger' absent/mal libellé : #{(get_text_suffix('btn-oui') rescue '(erreur)').inspect}" unless
      get_text_suffix('btn-oui') == 'Corriger'
  end
ensure
  remove_fixture_project(id) if id
end

board_test("service commun 'actualiser la documentation' : échec -> ErrorsDialog avec bouton Corriger") { run_test }
