# Test : SyntaxChecker.check_files (backend/lib/syntax_checker.rb) — pas
# d'app lancée, appel en sous-processus (comme backend.rb le ferait),
# suivant le même principe que git_commit_sans_depot_git.rb. Couvre
# ruby/node (bons langages "sûrs", installés partout où tourne la suite),
# fichier introuvable, extension inconnue (accept_unknown_file), outil
# absent (Errno::ENOENT) et timeout — pas les 19 autres langages de
# check_syntax.adoc, qui dépendent de toolchains optionnelles.

require 'open3'
require_relative '../../support/helpers_base'
include BoardTest

BACKEND_LIB = File.join(BoardTest::ROOT, 'backend', 'lib')

def run_checker(fixtures, accept_unknown_file: false)
  script = <<~RUBY
    require #{File.join(BACKEND_LIB, 'usefull.rb').inspect}
    require #{File.join(BACKEND_LIB, 'syntax_checker.rb').inspect}
    puts SyntaxChecker.check_files(#{fixtures.to_json}, accept_unknown_file: #{accept_unknown_file}).to_json
  RUBY
  # stdout et stderr séparés : le require d'usefull.rb lance un shell
  # interactif (load_real_user_path!) qui peut écrire sur stderr (ex.
  # message d'intégration iTerm2) — mélanger les deux casserait le JSON.
  out, err, _status = Open3.capture3('ruby', '-e', script)
  JSON.parse(out)
rescue JSON::ParserError
  raise "sortie non-JSON du sous-processus : stdout=#{out.inspect} stderr=#{err.inspect}"
end

# Appelle SyntaxChecker.run_checker (privée) directement — indépendant de
# CHECKERS_BY_EXT/check_files, pour tester le rescue Errno::ENOENT (outil
# absent) et le Timeout sans dépendre de ce qui est réellement installé sur
# la machine qui exécute la suite, ni attendre le vrai CHECK_TIMEOUT (60s).
def run_private_checker(cmd, timeout_override: nil)
  override_code = timeout_override ? "SyntaxChecker.singleton_class.send(:remove_const, :CHECK_TIMEOUT); SyntaxChecker.singleton_class.const_set(:CHECK_TIMEOUT, #{timeout_override})" : ''
  script = <<~RUBY
    require #{File.join(BACKEND_LIB, 'usefull.rb').inspect}
    require #{File.join(BACKEND_LIB, 'syntax_checker.rb').inspect}
    #{override_code}
    puts({error: SyntaxChecker.send(:run_checker, #{cmd.inspect})}.to_json)
  RUBY
  out, err, _status = Open3.capture3('ruby', '-e', script)
  JSON.parse(out)
rescue JSON::ParserError
  raise "sortie non-JSON du sous-processus : stdout=#{out.inspect} stderr=#{err.inspect}"
end

def run_test
  Dir.mktmpdir('board-test-syntax-') do |dir|
    good_rb = File.join(dir, 'good.rb')
    bad_rb  = File.join(dir, 'bad.rb')
    good_js = File.join(dir, 'good.js')
    unknown = File.join(dir, 'image.png')
    missing = File.join(dir, 'introuvable.rb')

    File.write(good_rb, "def foo\n  1\nend\n")
    File.write(bad_rb,  "def foo\n  1\n") # pas de 'end'
    File.write(good_js, "function foo(){ return 1 }\n")
    File.write(unknown, 'binaire factice')

    result = run_checker([good_rb, good_js])
    raise "ok attendu true, obtenu #{result.inspect}" unless result['ok']
    raise "bad_files devrait être vide, obtenu #{result['bad_files'].inspect}" unless result['bad_files'].empty?

    result = run_checker([good_rb, bad_rb])
    raise "ok attendu false, obtenu #{result.inspect}" if result['ok']
    err = result['errors'].find { |e| e['path'].end_with?('bad.rb') }
    raise "aucune erreur trouvée pour bad.rb : #{result['errors'].inspect}" unless err
    raise "le message devrait mentionner une ligne, obtenu #{err['error'].inspect}" unless err['error'] =~ /ligne/

    result = run_checker([missing])
    raise "ok attendu false pour fichier introuvable, obtenu #{result.inspect}" if result['ok']
    raise "message 'Fichier introuvable.' attendu, obtenu #{result['errors'].inspect}" \
      unless result['errors'].any? { |e| e['error'] == 'Fichier introuvable.' }

    result = run_checker([unknown])
    raise "ok attendu false pour extension inconnue (accept_unknown_file: false par défaut), obtenu #{result.inspect}" if result['ok']

    result = run_checker([unknown], accept_unknown_file: true)
    raise "ok attendu true avec accept_unknown_file: true, obtenu #{result.inspect}" unless result['ok']
    raise "bad_files devrait être vide, obtenu #{result['bad_files'].inspect}" unless result['bad_files'].empty?

    result = run_private_checker(['binaire-de-test-inexistant-xyz', good_rb])
    raise "message 'outil absent' attendu, obtenu #{result.inspect}" \
      unless result['error'] == 'Outil de vérification absent pour ce type de fichier.'

    result = run_private_checker(['sleep', '3'], timeout_override: 1)
    raise "message 'délai dépassé' attendu, obtenu #{result.inspect}" \
      unless result['error'] == 'Vérification interrompue (délai dépassé).'
  end
end

board_test("SyntaxChecker.check_files : valide/invalide, fichier introuvable, extension inconnue (accept_unknown_file)") { run_test }
