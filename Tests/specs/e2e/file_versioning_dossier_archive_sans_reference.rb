# Test : FileVersioning.rb (backend/scripts/FileVersioning.rb, service
# 'file-versioning') — cas où le dossier d'archive existe mais ne contient
# AUCUN fichier de référence correspondant au fichier source (dossier vide,
# ou seulement des fichiers sans rapport). Avant correction : `sorted_files`
# vide => `sorted_files.last` => nil => plantage sur `nil.next_version`
# (NoMethodError). Après correction : version par défaut 1.0.0.
#
# Test unitaire (pas d'app lancée) : invoque FileVersioning.rb en
# sous-processus, comme backend/lib/exec_script.rb le ferait pour le
# service 'file-versioning'. Même style que git_commit_sans_depot_git.rb.

require_relative '../../support/helpers_base'
include BoardTest

FILE_VERSIONING_RB = File.join(BoardTest::ROOT, 'backend', 'scripts', 'FileVersioning.rb')

def run_test
  Dir.mktmpdir('board-test-file-versioning-') do |dir|
    archive_dir = File.join(dir, 'archives')
    Dir.mkdir(archive_dir)

    source_path = File.join(dir, 'notes.txt')
    File.write(source_path, 'contenu de test')

    out = IO.popen(['ruby', FILE_VERSIONING_RB, source_path, archive_dir, 'patch'], err: [:child, :out], &:read)
    data = JSON.parse(out)

    raise "échec inattendu (dossier archive vide devrait donner une version par défaut), obtenu #{data.inspect}" unless data['ok']

    dest = File.join(archive_dir, 'notes-1.0.0.txt')
    raise "fichier de version par défaut #{dest.inspect} non créé (contenu du dossier : #{Dir.children(archive_dir).inspect})" unless File.exist?(dest)
  end
end

board_test("FileVersioning.rb : dossier archive sans fichier de référence => version par défaut 1.0.0 (pas de plantage)") { run_test }
