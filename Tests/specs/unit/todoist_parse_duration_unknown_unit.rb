require_relative '../../support/todoist_stub'
include BoardTest

def run_test
  # Cas de contrôle : une unité connue ne lève rien
  Todoist._parse_duration('3 jours', 'fr')

  # Unité inconnue → doit lever une erreur (pas de valeur par défaut silencieuse)
  raised = false
  begin
    Todoist._parse_duration('3 machins', 'fr')
  rescue => e
    raised = true
  end
  raise "une unité inconnue doit lever une exception" unless raised
end

board_test("Todoist._parse_duration : unité inconnue lève une erreur, pas de défaut silencieux") { run_test }
