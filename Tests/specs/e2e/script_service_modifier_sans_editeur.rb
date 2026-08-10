# Test : bouton "Le modifier…" (ScriptService.js#displayErrors) sur
# l'ErrorsDialog affichée quand un script-service a une étape invalide.
#
# BUG #2 : si aucun éditeur YAML/texte n'était configuré
# (APP_DATA['yaml-editor']/'text-editor'), le bouton ne faisait RIEN de
# visible — backend.rb lançait `open -a "" "chemin"` (commande cassée,
# jamais vérifiée), et le frontend (ScriptService.js#openData) ignorait de
# toute façon `retour.error`. Corrigé en 2 temps :
#   1. backend.rb se rabat sur l'appli par défaut du système (`open` sans
#      `-a`) quand aucun éditeur n'est configuré, plutôt que d'échouer.
#   2. ScriptService.js#openData affiche enfin `retour.error` quand
#      l'ouverture échoue malgré tout (ex. fichier inexistant), au lieu de
#      l'ignorer silencieusement.
# Ce test vérifie le point 2, seul cas encore capable d'échouer
# silencieusement : chemin garanti inexistant, indépendant de la présence
# ou non d'un éditeur configuré (couvert séparément pour le fallback).
#
# Couvre par la même occasion BUG #1 (message d'erreur de validation
# d'étape sans id — cf. script_service_step_validate.rb pour la couverture
# directe de ServStep#validate) en vérifiant que l'ErrorsDialog initiale
# mentionne bien l'id de l'étape fautive.

require_relative '../../support/helpers'

include BoardTest

def errors_panel_text
  bridge_eval("(document.querySelector('.error.small') || {}).textContent || ''")
end

def run_test
  id = nil
  original_app_data = read_app_data
  Dir.mktmpdir('board-test-project-') do |fixture_dir|
    # Pas d'éditeur configuré (scénario du bug) : on part de l'app data
    # réelle et on retire seulement ces 2 clés, avant même le lancement.
    app_data = original_app_data.dup
    app_data.delete('yaml-editor')
    app_data.delete('text-editor')
    write_app_data(app_data)

    yaml_path = File.join(fixture_dir, 'envoi.yaml')
    File.write(yaml_path, <<~YAML)
      - id: etape-bidule
        type: nawak-inconnu
    YAML

    service = fixture_script_service(yaml_path, name: 'Nouvel envoi')
    id = create_fixture_project(title: 'Projet A', path: fixture_dir, services: { 'startup' => [], 'others' => [service] })
    launch_app

    wait_for("project-#{id}")
    service_card = "service-#{service['uuid']}"
    wait_for(service_card)
    click(service_card)

    # → étape invalide (type inconnu) : ErrorsDialog immédiate avec bouton
    #   "Le modifier…" (ouiBtn) — BUG #1 : le message doit mentionner l'id
    #   de l'étape fautive.
    wait_until(10, desc: -> { "texte ErrorsDialog = #{(errors_panel_text rescue '(erreur)').inspect}" }) do
      !(errors_panel_text rescue '').empty?
    end
    raise "ErrorsDialog sans mention de l'id de l'étape fautive : #{errors_panel_text.inspect}" unless
      errors_panel_text.include?('etape-bidule')

    wait_for_suffix('btn-oui')
    click_suffix('btn-oui')

    # → BUG #2 : appel direct de ScriptService#openData avec un chemin
    #   garanti inexistant (open échoue quel que soit l'éditeur configuré
    #   ou non) — vérifie que retour.error est bien affiché, plus ignoré.
    bogus_path = "/inexistant-#{rand(36**8).to_s(36)}/fichier.yaml"
    bridge_eval(<<~JS)
      (function(){
        var svc = new ScriptService(null, #{bogus_path.to_json});
        svc.openData();
      })()
    JS
    wait_until(10, desc: -> { "texte ErrorsDialog après échec d'ouverture = #{(errors_panel_text rescue '(erreur)').inspect}" }) do
      (errors_panel_text rescue '').include?(bogus_path)
    end
  end
ensure
  write_app_data(original_app_data) if original_app_data
  remove_fixture_project(id) if id
end

board_test("script-service : ErrorsDialog mentionne l'id de l'étape, et 'Le modifier…' signale l'absence d'éditeur configuré") { run_test }
