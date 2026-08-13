# Vérification de syntaxe multi-langages, conforme à
# _dev/Manuel/adocs/annexes/check_syntax.adoc — une commande par langage,
# lancée par fichier (un fichier = un process, quel que soit le langage :
# uniforme, même si certains outils accepteraient plusieurs fichiers).

require 'open3'
require 'timeout'
require 'tmpdir'

class SyntaxChecker
class << self

  CHECKERS_BY_EXT = {
    %w[.rb .rbw]                                          => ->(p){ ['ruby', '-c', p] },
    %w[.js .mjs .cjs]                                     => ->(p){ ['node', '--check', p] },
    %w[.ts .mts .cts]                                     => ->(p){ ['tsc', '--noEmit', p] },
    %w[.py .pyw]                                          => ->(p){ ['python3', '-m', 'py_compile', p] },
    %w[.php .php3 .php4 .php5 .phtml]                     => ->(p){ ['php', '-l', p] },
    %w[.pl .pm .t .psgi]                                  => ->(p){ ['perl', '-c', p] },
    %w[.sh .bash .bats]                                   => ->(p){ ['bash', '-n', p] },
    %w[.zsh]                                              => ->(p){ ['zsh', '-n', p] },
    %w[.fish]                                             => ->(p){ ['fish', '--no-execute', p] },
    %w[.lua]                                              => ->(p){ ['luac', '-p', p] },
    %w[.go]                                               => ->(p){ ['go', 'build', '-o', File::NULL, p] },
    %w[.rs]                                               => ->(p){ ['rustc', '--crate-type', 'lib', '-o', File::NULL, p] },
    %w[.c .h]                                             => ->(p){ ['gcc', '-fsyntax-only', p] },
    %w[.cc .cp .cpp .cxx .c++ .C .hh .hp .hpp .hxx .h++]  => ->(p){ ['g++', '-fsyntax-only', p] },
    %w[.java]                                             => ->(p){ ['javac', '-d', Dir.mktmpdir, p] },
    %w[.kt .kts]                                          => ->(p){ ['kotlinc', p, '-d', Dir.mktmpdir] },
    %w[.swift]                                            => ->(p){ ['swiftc', '-parse', p] },
    %w[.dart]                                             => ->(p){ ['dart', 'analyze', p] },
    %w[.R .r .Rmd]                                        => ->(p){ ['Rscript', '-e', "parse(file=#{p.inspect})"] },
    %w[.html .htm]                                        => ->(p){ ['tidy', '-q', '-e', p] },
    %w[.css]                                              => ->(p){ ['stylelint', p] },
    %w[.adoc .asciidoc]                                   => ->(p){ ['asciidoctor', '--failure-level=WARN', '-o', File::NULL, p] },
    %w[.ex .exs]                                          => ->(p){ ['elixirc', '-o', Dir.mktmpdir, p] }
  }.each_with_object({}) { |(exts, cmd), h| exts.each { |e| h[e] = cmd } }

  CHECK_TIMEOUT = 60 # secondes, par fichier — même valeur que SCRIPT_TIMEOUT (usefull.rb)

  # +files+ : liste de paths (extensions quelconques et différentes).
  # +accept_unknown_file+ : true pour ignorer silencieusement (ok) les
  # fichiers d'un type absent de CHECKERS_BY_EXT (ex. images, PDF, dans un
  # lot "tous les fichiers") — false par défaut, où ils comptent en erreur.
  def check_files(files, accept_unknown_file: false)
    bad_files = []
    errors = []

    files.each do |path|
      error_message = check_file(path, accept_unknown_file)
      next if error_message.nil? || error_message == :ok
      bad_files << rel
      errors << { path: rel, error: error_message }
    end

    { ok: errors.empty?, bad_files: bad_files, errors: errors }
  end

  def check_file(path, accept_unknown_file)
    rel = relative_path(path)

    unless File.exist?(path)
      return ['backend-unfound-file', path]
    end

    cmd_builder = CHECKERS_BY_EXT[File.extname(path)]
    if cmd_builder.nil?
      if accept_unknown_file
        return :ok 
      else
        return ['unknown-syntax-file-extension', File.extname(path)]
      end
    end
    # Checker la syntax, vraiment
    return run_checker(cmd_builder.call(path))
  end

  private

  def relative_path(path)
    path.start_with?("#{APP_FOLDER}/") ? path.sub("#{APP_FOLDER}/", '') : path
  end

  # nil = fichier correct. Sinon message d'erreur simple (avec
  # ligne/colonne quand la sortie de l'outil les mentionne).
  def run_checker(cmd)
    out, status = Timeout.timeout(CHECK_TIMEOUT) { Open3.capture2e(*cmd) }
    return nil if status.success?
    describe_error(out)
  rescue Errno::ENOENT
    'Outil de vérification absent pour ce type de fichier.'
  rescue Timeout::Error
    'Vérification interrompue (délai dépassé).'
  end

  def describe_error(out)
    if (m = out.match(/:(\d+):(\d+)/))
      "Erreur de syntaxe (ligne #{m[1]}, colonne #{m[2]})."
    elsif (m = out.match(/:(\d+):/) || out.match(/line (\d+)/i))
      "Erreur de syntaxe (ligne #{m[1]})."
    else
      'Erreur de syntaxe.'
    end
  end

end
end
