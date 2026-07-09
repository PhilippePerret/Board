# Fonctions partagées par tous les fichiers de test (Tests/specs/**/*.rb).
# Pilotage de Board.app via AppleScript/System Events (ciblage par AXDOMIdentifier).

require 'yaml'
require 'json'
require 'fileutils'
require 'tmpdir'

module BoardTest
  ROOT                 = File.expand_path('../..', __dir__)
  AX_SCRIPT             = File.join(ROOT, 'Tests', 'support', 'ax.applescript')
  FINDER_SCRIPT          = File.join(ROOT, 'Tests', 'support', 'finder.applescript')
  BOARD_APP             = File.join(ROOT, 'Board.app')
  BOARD_SUPPORT_DIR     = File.join(Dir.home, 'Library', 'Application Support', 'Board')
  PROJECT_CARD_FOLDER   = File.join(BOARD_SUPPORT_DIR, 'project-cards')

  GREEN  = "\e[32m"
  RED    = "\e[31m"
  YELLOW = "\e[33m"
  RESET  = "\e[0m"

  class Pending < StandardError; end

  module_function

  def pending(message)
    raise Pending, message
  end

  # Encadre un test : imprime PASS/FAIL/PENDING et sort avec le code
  # correspondant (0/1/2), lu par Tests/run_tests.sh pour le résumé.
  def board_test(name)
    yield
    puts "#{GREEN}PASS#{RESET}: #{name}"
    exit 0
  rescue Pending => e
    puts "#{YELLOW}PENDING#{RESET}: #{name} — #{e.message}"
    exit 2
  rescue => e
    puts "#{RED}FAIL#{RESET}: #{name} — #{e.message}"
    exit 1
  end

  def osascript(script, *args)
    out = IO.popen(['osascript', script, *args.map(&:to_s)], err: [:child, :out], &:read)
    raise "osascript a échoué (#{script} #{args.join(' ')}) : #{out}" unless $?.success?
    out.strip
  end

  def click(dom_id)                 = osascript(AX_SCRIPT, 'click', dom_id)
  def click_prefix(prefix)          = osascript(AX_SCRIPT, 'click-prefix', prefix)
  def set_value(dom_id, value)      = osascript(AX_SCRIPT, 'set-value', dom_id, value)
  def set_value_prefix(prefix, value) = osascript(AX_SCRIPT, 'set-value-prefix', prefix, value)
  def get_value(dom_id)             = osascript(AX_SCRIPT, 'get-value', dom_id)
  def get_value_prefix(prefix)      = osascript(AX_SCRIPT, 'get-value-prefix', prefix)
  def wait_for(dom_id, timeout = 5) = osascript(AX_SCRIPT, 'wait-for', dom_id, timeout)
  def wait_for_prefix(prefix, timeout = 5) = osascript(AX_SCRIPT, 'wait-for-prefix', prefix, timeout)

  def finder_select(posix_path)
    osascript(FINDER_SCRIPT, 'select', posix_path)
  end

  def finder_window_ids
    osascript(FINDER_SCRIPT, 'window-ids').split("\n")
  end

  def finder_close_window(window_id)
    osascript(FINDER_SCRIPT, 'close-window', window_id)
  end

  # Sélectionne posix_path dans le Finder, exécute le bloc, puis ferme les
  # fenêtres Finder que la sélection a ouvertes (best-effort : si le dossier
  # a déjà été supprimé et sa fenêtre déjà fermée par macOS, no-op).
  def with_finder_selection(posix_path)
    before_ids = finder_window_ids
    finder_select(posix_path)
    new_ids = finder_window_ids - before_ids
    yield
  ensure
    new_ids&.each { |id| finder_close_window(id) }
  end

  def launch_app
    system('pkill', '-x', 'Board', out: File::NULL, err: File::NULL)
    sleep 0.5
    system('open', BOARD_APP)
    sleep 1.5
  end

  def quit_app
    system('pkill', '-x', 'Board', out: File::NULL, err: File::NULL)
  end
end
