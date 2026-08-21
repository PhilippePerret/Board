# Évaluation rapide d'un bout de code (outil "Évaluer du code", panneau
# Outils) — un seul fichier, une commande par langage (même liste que
# SyntaxChecker, backend/lib/syntax_checker.rb, mais pour LANCER le code
# au lieu de juste vérifier sa syntaxe), un seul runner générique. Pas de
# traitement ligne par ligne : on remonte le résultat final (dernière
# ligne de sortie) ou l'erreur.
#
# Le langage est choisi côté frontend (menu au-dessus du textarea,
# EvalCodeDialog) et reçu tel quel ici, en paramètre — pas de détection à
# partir du code.
#
# html/css/adoc (présents dans SyntaxChecker) absents ici : ce sont des
# formats à vérifier, pas du code à exécuter — pas de notion de "résultat"
# pour eux. java/C/C++/Rust : compilation + exécution en une seule
# commande shell — plus fragile (java exige une classe nommée Main,
# g++/gcc/rustc écrivent un binaire temporaire), mais reste UNE ligne de
# table, pas un module séparé.

require 'open3'
require 'timeout'
require 'tmpdir'

class CodeEval
class << self

  RUN_CMD_BY_LANG = {
    'ruby'       => ->(p){ ['ruby', p] },
    'javascript' => ->(p){ ['node', p] },
    'python'     => ->(p){ ['python3', p] },
    'php'        => ->(p){ ['php', p] },
    'perl'       => ->(p){ ['perl', p] },
    'bash'       => ->(p){ ['bash', p] },
    'zsh'        => ->(p){ ['zsh', p] },
    'fish'       => ->(p){ ['fish', p] },
    'lua'        => ->(p){ ['lua', p] },
    'go'         => ->(p){ ['go', 'run', p] },
    'swift'      => ->(p){ ['swift', p] },
    'dart'       => ->(p){ ['dart', 'run', p] },
    'r'          => ->(p){ ['Rscript', p] },
    'elixir'     => ->(p){ ['elixir', p] },
    'kotlin'     => ->(p){ ['kotlin', p] },
    'rust'       => ->(p){ ['sh', '-c', "rustc -O -o #{File.dirname(p)}/a.out #{p} 2>&1 && #{File.dirname(p)}/a.out"] },
    'c'          => ->(p){ ['sh', '-c', "gcc #{p} -o #{File.dirname(p)}/a.out 2>&1 && #{File.dirname(p)}/a.out"] },
    'c++'        => ->(p){ ['sh', '-c', "g++ #{p} -o #{File.dirname(p)}/a.out 2>&1 && #{File.dirname(p)}/a.out"] },
    # java exige une classe publique nommée Main (contrainte du langage,
    # pas contournable pour un simple bout de code collé tel quel).
    'java'       => ->(p){ ['sh', '-c', "cp #{p} #{File.dirname(p)}/Main.java && cd #{File.dirname(p)} && javac Main.java 2>&1 && java Main"] }
  }

  # Pour le bouton "En faire un script" (EvalCodeDialog) — interpréteur à
  # placer en shebang. nil pour les langages compilés (rust/c/c++/java) :
  # pas de notion de script autonome exécutable pour eux.
  SHEBANG_BY_LANG = {
    'ruby'       => '/usr/bin/env ruby',
    'javascript' => '/usr/bin/env node',
    'python'     => '/usr/bin/env python3',
    'php'        => '/usr/bin/env php',
    'perl'       => '/usr/bin/env perl',
    'bash'       => '/usr/bin/env bash',
    'zsh'        => '/usr/bin/env zsh',
    'fish'       => '/usr/bin/env fish',
    'lua'        => '/usr/bin/env lua',
    'go'         => '/usr/bin/env -S go run',
    'swift'      => '/usr/bin/env swift',
    'dart'       => '/usr/bin/env -S dart run',
    'r'          => '/usr/bin/env Rscript',
    'elixir'     => '/usr/bin/env elixir',
    'kotlin'     => '/usr/bin/env kotlin',
    'rust'       => nil,
    'c'          => nil,
    'c++'        => nil,
    'java'       => nil
  }

  EVAL_TIMEOUT = 15 # secondes — outil "rapide", pas de raison d'attendre plus

  # Crée +name+ dans +folder+ avec le shebang de +language+ suivi de
  # +code+, puis le rend exécutable (chmod 0755).
  def create_script(language, code, folder, name)
    shebang = SHEBANG_BY_LANG[language]
    if shebang.nil?
      RETOUR.error = ['unknown-shebang', language]
      return nil
    end
    path = File.join(folder, name)
    if File.exist?(path)
      RETOUR.error = ['file-already-exists-at', path]
      return nil
    end
    File.write(path, "#!#{shebang}\n#{code}")
    File.chmod(0755, path)
    { path: path }
  end

  def run(language, code)
    return { ok: false, error: "Langage non supporté : #{language}." } unless RUN_CMD_BY_LANG.key?(language)

    Dir.mktmpdir do |dir|
      path = File.join(dir, "code.#{language}")
      # 'use strict' : sans ça, node exécute en mode non strict (script
      # CommonJS classique) — une affectation sur variable non déclarée
      # crée une globale au lieu de lever une erreur, contraire au but de
      # l'outil (détecter les erreurs).
      code_to_run = language == 'javascript' ? "'use strict';\n#{code}" : code
      File.write(path, code_to_run)

      out = err = status = nil
      begin
        Timeout.timeout(EVAL_TIMEOUT) { out, err, status = Open3.capture3(*RUN_CMD_BY_LANG[language].call(path)) }
      rescue Timeout::Error
        return { ok: false, error: "Délai dépassé (> #{EVAL_TIMEOUT}s)." }
      rescue Errno::ENOENT
        return { ok: false, error: "Interpréteur/compilateur introuvable pour #{language}." }
      end

      if status.success?
        { ok: true, result: last_meaningful_line(out) || last_meaningful_line(err) || '(aucune sortie)' }
      else
        error = error_line(err) || error_line(out) || 'Erreur inconnue.'
        # Le chemin du fichier temp (jamais utile à l'utilisateur) pollue
        # les messages d'erreur de la plupart des interpréteurs — retiré,
        # ne garde que "code.<langage>:ligne…".
        { ok: false, error: error.gsub("#{dir}/", '') }
      end
    end
  end

  private

  def last_meaningful_line(text)
    return nil if text.nil?
    lines = text.split("\n").map(&:strip).reject(&:empty?)
    lines.last
  end

  # La ligne de message d'erreur n'est pas toujours la dernière (ex. node,
  # qui termine sa trace par "Node.js vX.Y.Z", après le vrai message) —
  # on cherche la première ligne qui RESSEMBLE à un message d'erreur
  # (ruby, node, python la formulent tous ainsi), sinon on retombe sur la
  # dernière ligne non vide.
  ERROR_LINE_RE = /\b[A-Z][A-Za-z]*Error\b/

  def error_line(text)
    return nil if text.nil?
    lines = text.split("\n").map(&:strip).reject(&:empty?)
    lines.find { |l| l.match?(ERROR_LINE_RE) } || lines.last
  end

end
end
