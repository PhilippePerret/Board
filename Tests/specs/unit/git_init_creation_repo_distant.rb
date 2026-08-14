# Test : Git.create_remote_repo / Git.init_for_project quand le dépôt
# distant n'existe pas encore -> en attente : testerait la création RÉELLE
# d'un dépôt Github (`gh repo create`) que le token actuel ne peut pas
# supprimer ensuite (scope `delete_repo` absent) — pas de repo de test
# jetable en plus pour ce seul cas. `gh repo create` lui-même est déjà
# prouvé fonctionner (utilisé pour créer Repo-For-Tests en amont).

require_relative '../../support/git_class_helpers'
include BoardTest
include GitClassTestHelpers

board_test("Git.create_remote_repo / init_for_project : création réelle d'un dépôt distant") do
  pending "créerait un vrai dépôt Github non supprimable (scope delete_repo absent du token) " \
    "— gh repo create déjà validé par ailleurs (création de Repo-For-Tests)"
end
