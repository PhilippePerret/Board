# Fonctions partagées par tous les fichiers de test (Tests/specs/**/*.rb).
# Pilotage de Board.app via le moteur "pont" (Tests/version-pont/support/helpers.rb,
# canal direct vers le JS de la WKWebView) — seul moteur restant.

require 'yaml'
require 'json'
require 'fileutils'
require 'tmpdir'

module BoardTest
  ROOT                  = File.expand_path('../..', __dir__)
  FINDER_SCRIPT          = File.join(ROOT, 'Tests', 'support', 'finder.applescript')
  DRAG_SCRIPT            = File.join(ROOT, 'Tests', 'support', 'drag.js')
  HOVER_SCRIPT           = File.join(ROOT, 'Tests', 'support', 'hover.js')
  BOARD_APP             = File.join(ROOT, 'Board.app')
  BOARD_SUPPORT_DIR     = File.join(Dir.home, 'Library', 'Application Support', 'Board')
  PROJECT_CARD_FOLDER   = File.join(BOARD_SUPPORT_DIR, 'project-cards')
  APP_DATA_FILE         = File.join(BOARD_SUPPORT_DIR, 'appdata.yaml')
  LOC_ERRORS_FILE       = File.join(ROOT, 'frontend', 'js', 'MES_ERRORS.js')

  GREEN  = "\e[32m"
  RED    = "\e[91m"
  YELLOW = "\e[33m"
  GRAY   = "\e[90m"
  RESET  = "\e[0m"

  class Pending < StandardError; end

  # Cumul du temps passé dans osascript (tous appels confondus) pour le
  # process ruby courant (1 process = 1 spec, cf. Tests/version-*/run_tests.sh).
  @@osascript_calls = 0
  @@osascript_time  = 0.0

  module_function

  def osascript_stats
    [@@osascript_calls, @@osascript_time]
  end

  def pending(message)
    raise Pending, message
  end

  # Lit le message d'erreur directement dans frontend/js/MES_ERRORS.js
  # (ERRORS[key]) au lieu de le dupliquer en dur dans les tests.
  def loc_error(key)
    content = File.read(LOC_ERRORS_FILE)
    match = content.match(/'#{Regexp.escape(key)}'\s*:\s*'((?:\\.|[^'\\])*)'/)
    raise "Clé introuvable dans MES_ERRORS.js : #{key.inspect}" unless match
    match[1].gsub(/\\(.)/, '\1')
  end

  # Encadre un test : imprime le résultat (coche verte/rouge, ligne rouge
  # entière en cas d'échec) et sort avec le code correspondant (0/1/2),
  # lu par Tests/run_tests.sh pour le résumé.
  def board_test(name)
    yield
    puts "#{GREEN}✓ #{name}#{RESET}"
    print_timing
    exit 0
  rescue Pending => e
    puts "#{YELLOW}○ #{name}\n    #{e.message}#{RESET}"
    print_timing
    exit 2
  rescue => e
    puts "#{RED}✗ #{name}\n    #{e.message}#{RESET}"
    print_timing
    exit 1
  end

  def print_timing
    calls, time = osascript_stats
    puts "#{GRAY}  (osascript : #{calls} appel#{'s' if calls != 1}, #{'%.3f' % time}s)#{RESET}"
  end

  # Extrait pour que les moteurs qui n'appellent pas osascript() directement
  # (ex. version-pers, qui parle à un process déjà lancé par pipe)
  # alimentent quand même les mêmes stats / la même ligne affichée par
  # print_timing.
  def record_osascript_call(elapsed)
    @@osascript_calls += 1
    @@osascript_time += elapsed
  end

  def osascript(script, *args)
    t0 = Process.clock_gettime(Process::CLOCK_MONOTONIC)
    out = IO.popen(['osascript', script, *args.map(&:to_s)], err: [:child, :out], &:read)
    record_osascript_call(Process.clock_gettime(Process::CLOCK_MONOTONIC) - t0)
    raise "osascript a échoué (#{script} #{args.join(' ')}) : #{out}" unless $?.success?
    out.strip
  end


  # Vérifie positivement le contenu de #message après un exec-service, au
  # lieu de deviner à quoi ressemble un texte d'échec (fragile : dépend de
  # la forme exacte prise par l'erreur ce jour-là). Par défaut, exige la
  # présence de "succès" (mot commun aux messages de succès des scripts
  # backend/scripts/*.scpt) — passer `expect:` pour un autre motif.
  def assert_service_message_ok!(timeout: 4, expect: /succès/i)
    wait_until(timeout, desc: -> { "#message = #{(get_text('message') rescue '(erreur)').inspect}" }) do
      (get_text('message') rescue '') != 'Message footer'
    end
    msg = get_text('message').to_s
    raise "Le service a échoué (#message = #{msg.inspect})" unless msg =~ expect
  end

  # Glisser-déposer par coordonnées écran (mouse down/move/up réels) — pour
  # le drag-and-drop HTML5 natif, qu'un simple click() ne peut pas
  # déclencher. Voir Tests/support/drag.js. Non vérifié en conditions
  # réelles (CoreGraphics/CGEvent jamais testé en live dans cette session).
  def drag(from_dom_id, to_dom_id)
    t0 = Process.clock_gettime(Process::CLOCK_MONOTONIC)
    out = IO.popen(['osascript', '-l', 'JavaScript', DRAG_SCRIPT, from_dom_id, to_dom_id], err: [:child, :out], &:read)
    record_osascript_call(Process.clock_gettime(Process::CLOCK_MONOTONIC) - t0)
    raise "drag a échoué (#{from_dom_id} → #{to_dom_id}) : #{out}" unless $?.success?
    out.strip
  end

  # Survol réel (souris déplacée par CoreGraphics, pas juste un événement JS
  # de synthèse) — nécessaire pour révéler un élément caché par
  # "display:none" (ex. les services au démarrage, Project.js), qui n'a
  # aucune représentation dans l'arbre d'accessibilité tant qu'il est masqué.
  def hover(dom_id, seconds = 1.5)
    t0 = Process.clock_gettime(Process::CLOCK_MONOTONIC)
    out = IO.popen(['osascript', '-l', 'JavaScript', HOVER_SCRIPT, dom_id, seconds.to_s], err: [:child, :out], &:read)
    record_osascript_call(Process.clock_gettime(Process::CLOCK_MONOTONIC) - t0)
    raise "hover a échoué (#{dom_id}) : #{out}" unless $?.success?
    out.strip
  end

  def finder_select(posix_path)
    osascript(FINDER_SCRIPT, 'select', posix_path)
  end

  # Ouvre une vraie fenêtre CIBLÉE sur posix_path (contrairement à
  # finder_select/reveal, qui ouvre une fenêtre sur le dossier parent).
  def finder_open_window(posix_path)
    osascript(FINDER_SCRIPT, 'open-window', posix_path)
  end

  def finder_deselect
    osascript(FINDER_SCRIPT, 'deselect')
  end

  def finder_front_window_name
    osascript(FINDER_SCRIPT, 'front-window-name')
  end

  # Étape 1 (légère, répétée dans le polling) : id de fenêtre par NOM parmi
  # TOUTES les fenêtres (pas "front window" — l'user a en général d'autres
  # process/fenêtres Terminal ouverts en parallèle). Ne raise pas (polling
  # via wait_until) : nil si aucune fenêtre ne correspond encore.
  def terminal_window_id_named(name_substring)
    out = IO.popen(['osascript', '-e', %Q(tell application "Terminal" to get id of (first window whose name contains "#{name_substring}"))], err: [:child, :out], &:read)
    return nil unless $?.success?
    id = out.strip.to_i
    id.zero? ? nil : id
  end

  # Tous les ids de fenêtres Terminal actuellement ouvertes — pour repérer
  # la fenêtre créée par un "do script" par différence (avant/après) plutôt
  # que par nom/contenu, qui peuvent être effacés par un "clear" du script
  # lui-même.
  def terminal_all_window_ids
    out = IO.popen(['osascript', '-e', %Q(tell application "Terminal" to get id of every window)], err: [:child, :out], &:read)
    return [] unless $?.success?
    out.strip.split(', ').map(&:to_i)
  end

  TERMINAL_FIND_TAB_INDEX_SCRIPT = <<~'APPLESCRIPT'
    on run argv
      set wid to (item 1 of argv) as integer
      set theMarker to item 2 of argv
      tell application "Terminal"
        set foundIdx to 0
        set i to 0
        repeat with t in tabs of (first window whose id is wid)
          set i to i + 1
          if (history of t) contains theMarker then set foundIdx to i
        end repeat
        return foundIdx as string
      end tell
    end run
  APPLESCRIPT

  # Étape 2 (un seul appel, pas de polling) : une fois la fenêtre trouvée
  # par nom, quel tab EXACT contient +marker+ dans son historique — scanne
  # seulement les tabs de CETTE fenêtre (pas toutes les fenêtres, contrairement
  # à une 1re version qui refaisait ce scan complet à chaque poll : requête
  # Apple Event lourde et répétée ~50 fois/10s, qui pouvait retarder le
  # traitement du "do script" en cours par Terminal au moment critique).
  # "selected tab of window id X" (essayé avant) suit le tab *actif* de la
  # fenêtre, qui peut ne pas être le bon si la fenêtre a plusieurs tabs —
  # d'où un ciblage par contenu, mais fait une seule fois, pas en boucle.
  def terminal_tab_index_matching(window_id, marker)
    out = IO.popen(['osascript', '-e', TERMINAL_FIND_TAB_INDEX_SCRIPT, window_id.to_s, marker], err: [:child, :out], &:read)
    return nil unless $?.success?
    idx = out.strip.to_i
    idx.zero? ? nil : idx
  end

  # Scrollback complet d'un tab Terminal ciblé par (window_id, tab_index).
  def terminal_tab_history(window_id, tab_index)
    out = IO.popen(['osascript', '-e', %Q(tell application "Terminal" to get history of (tab #{tab_index} of window id #{window_id}))], err: [:child, :out], &:read)
    raise "lecture de l'historique du tab (window id #{window_id}, tab #{tab_index}) a échoué : #{out}" unless $?.success?
    out
  end

  TERMINAL_DUMP_SCRIPT = <<~'APPLESCRIPT'
    tell application "Terminal"
      set out to ""
      repeat with w in windows
        set out to out & "[window id=" & (id of w) & " name=" & (name of w) & "]" & linefeed
        set i to 0
        repeat with t in tabs of w
          set i to i + 1
          set out to out & "  tab " & i & " history=<<<" & (history of t) & ">>>" & linefeed
        end repeat
      end repeat
      return out
    end tell
  APPLESCRIPT

  # État complet de toutes les fenêtres/tabs Terminal au moment de l'appel —
  # à inclure dans un message d'échec (desc de wait_until) pour diagnostiquer
  # en un seul run plutôt qu'en itérant des correctifs à l'aveugle.
  def terminal_debug_dump
    IO.popen(['osascript', '-e', TERMINAL_DUMP_SCRIPT], err: [:child, :out], &:read)
  end

  def terminal_close_window(window_id)
    out = IO.popen(['osascript', '-e', %Q(tell application "Terminal" to close (every window whose id is #{window_id}))], err: [:child, :out], &:read)
    raise "fermeture de la fenêtre Terminal (id #{window_id}) a échoué : #{out}" unless $?.success?
    out.strip
  end

  # Ne ferme QUE si la fenêtre Finder au premier plan porte bien ce nom au
  # moment de fermer (pas seulement au moment de l'ouverture) — si autre
  # chose a pris le focus entre-temps (une fenêtre Finder personnelle de
  # l'utilisateur, par exemple), on ne touche à rien.
  def finder_close_front_window_if_named(expected_name)
    osascript(FINDER_SCRIPT, 'close-front-window-if-named', expected_name)
  end

  # OpenFolderProject.scpt fait "activate" + "make new Finder window" : la
  # fenêtre qui nous intéresse est donc, par construction, celle au premier
  # plan juste après le clic — pas besoin de comparer des chemins (source de
  # bugs : liens symboliques macOS type /var -> /private/var, entre autres).
  # On vérifie juste que son nom (= nom du dossier affiché) correspond.
  def click_service_and_wait_folder(service_dom_id, fixture_dir, timeout: 10)
    click(service_dom_id)
    raise "Board a quitté juste après le clic sur #{service_dom_id}" unless board_running?
    expected_name = File.basename(fixture_dir)
    wait_until(timeout, desc: -> { "nom de la fenêtre Finder au premier plan = #{finder_front_window_name.inspect} (attendu #{expected_name.inspect})" }) do
      finder_front_window_name == expected_name
    end
  end

  def close_folder_and_wait(fixture_dir, timeout: 5)
    expected_name = File.basename(fixture_dir)
    result = finder_close_front_window_if_named(expected_name)
    raise "fermeture du dossier échouée : #{result}" unless result == 'ok'
    raise "Board a quitté juste après la fermeture du dossier Finder" unless board_running?
    result
  end

  # Ouvre une fenêtre Finder neutre (rien de sélectionné dedans), exécute le
  # bloc, puis referme CETTE fenêtre précise — "make new Finder window"
  # (finder_deselect) devient toujours la fenêtre au premier plan par
  # construction (même garantie que click_service_and_wait_folder), donc son
  # nom capturé à l'ouverture est sans ambiguïté ; on revérifie quand même ce
  # nom juste avant de fermer (finder_close_front_window_if_named), au cas où
  # autre chose aurait pris le focus entre-temps — sinon on ne ferme rien.
  def with_finder_deselected
    expected_name = finder_deselect
    yield
  ensure
    (finder_close_front_window_if_named(expected_name) rescue nil) if expected_name && !expected_name.empty?
  end

  # Poll côté Ruby (utile pour attendre un texte/état qui dépend d'un
  # aller-retour backend, pas juste de la présence d'un élément DOM).
  #
  # desc: proc appelé SEULEMENT en cas de timeout, pour rapporter l'état réel
  # à ce moment-là (pas au moment de l'appel) dans le message d'erreur.
  def wait_until(timeout = 4, interval = 0.2, desc: nil)
    deadline = Time.now + timeout
    loop do
      return true if yield
      if Time.now > deadline
        detail = desc && (desc.call rescue "(desc a échoué : #{$!.message})")
        raise "Timeout d'attente dépassé (#{timeout}s)" + (detail ? " — #{detail}" : "")
      end
      sleep interval
    end
  end

  def finder_window_ids
    osascript(FINDER_SCRIPT, 'window-ids').split("\n")
  end

  def finder_close_window(window_id)
    osascript(FINDER_SCRIPT, 'close-window', window_id)
  end

  # Snapshot/restore de toutes les fenêtres Finder ouvertes (dossier,
  # position, sélection de la fenêtre de devant) — appelé une fois avant et
  # une fois après toute la suite (Tests/version-*/run_tests.sh), pas par
  # spec : filet de sécurité global plutôt qu'une fermeture au cas par cas.
  def finder_snapshot_windows
    osascript(FINDER_SCRIPT, 'snapshot-windows')
  end

  def finder_close_all_windows
    osascript(FINDER_SCRIPT, 'close-all-windows')
  end

  def finder_restore_windows(snapshot)
    osascript(FINDER_SCRIPT, 'restore-windows', snapshot)
  end

  # Sélectionne posix_path dans le Finder ("reveal", garanti fenêtre au
  # premier plan sur l'élément précis — cf. finder.applescript), exécute le
  # bloc, puis referme CETTE fenêtre précise (nom revérifié juste avant
  # fermeture, même sécurité que with_finder_deselected).
  def with_finder_selection(posix_path)
    expected_name = finder_select(posix_path)
    yield
  ensure
    (finder_close_front_window_if_named(expected_name) rescue nil) if expected_name && !expected_name.empty?
  end

  # Ouvre une vraie fenêtre CIBLÉE sur posix_path (finder_open_window, pas un
  # reveal), exécute le bloc, puis referme cette fenêtre précise. Nécessaire
  # dès qu'un param de type 'finder-window' est en jeu : le script backend a
  # besoin du CHEMIN réel de la fenêtre, pas seulement de sa position/taille.
  def with_finder_window(posix_path)
    expected_name = finder_open_window(posix_path)
    yield
  ensure
    (finder_close_front_window_if_named(expected_name) rescue nil) if expected_name && !expected_name.empty?
  end

  # Sélectionne le projet +project_id+, ouvre son panneau de services, glisse
  # le service +service_id+ jusqu'à "Autres services" (ou "Services au
  # démarrage" si where: 'startup'), puis répond aux 3 boîtes de dialogue qui
  # suivent (nom, fenêtre Finder, sidebar) — cf.
  # Tests/specs/e2e/attribution_service.rb pour le détail de ce déroulé.
  # +fixture_dir+ : dossier réel du projet (nécessaire pour l'étape fenêtre
  # Finder). Retourne l'uuid attribué au service une fois attaché et
  # confirmé persisté dans la carte projet.
  def attach_service_to_project(service_id, project_id, fixture_dir, custom_name:, where: 'others')
    card = "project-#{project_id}"
    drop_field = "project-#{project_id}-#{where}-field"

    wait_for(card)
    click(card)
    wait_until(5, desc: -> { 'common-services-panel-toggle pas apparu après sélection' }) { exists?('common-services-panel-toggle') }
    click('common-services-panel-toggle')
    wait_for(service_id)

    drag(service_id, drop_field)

    wait_for('__service-name__')
    set_value('__service-name__', custom_name)
    click('btn-oui')

    wait_for('btn-oui')
    with_finder_window(fixture_dir) do
      click('btn-oui')
      wait_for('btn-oui')
    end
    click('btn-oui')

    uuid = nil
    wait_until(desc: -> { "carte projet = #{read_project_card(project_id).inspect}" }) do
      list = read_project_card(project_id)['services'][where]
      found = list.is_a?(Array) && list.find { |s| Array(s['name']).include?(custom_name) }
      uuid = found['uuid'] if found
      !!found
    end
    uuid
  end

  def board_running?
    system('pgrep', '-x', 'Board', out: File::NULL, err: File::NULL)
  end

  # Nombre de fenêtres natives de Board (fenêtre principale + fenêtres
  # annexes type HelpWindowController) — indépendant du DOM/bridge, utile
  # pour vérifier qu'une fenêtre Swift s'est bien ouverte/fermée.
  def board_window_count
    out = IO.popen(['osascript', '-e', 'tell application "System Events" to count windows of process "Board"'], err: [:child, :out], &:read)
    out.strip.to_i
  end

  # Ferme une fenêtre native de Board par son titre exact (bouton de
  # fermeture du titre, pas un raccourci clavier — évite de dépendre du
  # focus courant).
  def close_board_window_named(title)
    IO.popen(['osascript', '-e', %Q(tell application "System Events" to click button 1 of window "#{title}" of process "Board")], err: [:child, :out], &:read)
    $?.success?
  end

  # Tue le process s'il tourne, attend sa mort effective, relance, puis
  # attend que l'interface soit réellement prête (plutôt que des sleep fixes
  # qui peuvent laisser un ancien et un nouveau process se chevaucher).
  def launch_app
    system('pkill', '-x', 'Board', out: File::NULL, err: File::NULL)
    wait_until(5, 0.1, desc: -> { 'process Board encore actif après pkill' }) { !board_running? }

    # "open" échoue parfois juste après un pkill (LaunchServices pas encore
    # à jour : _LSOpenURLsWithCompletionHandler error -600) — quelques essais.
    # "open" ne transmet PAS l'environnement du shell appelant à l'app lancée
    # (moteur "pont") : sans --env ici, Sources/Board/TestBridge.swift ne
    # verrait jamais BOARD_TEST_BRIDGE_SOCKET lors d'un rechargement en cours
    # de spec — no-op pour les autres moteurs (variable absente de leur env).
    open_args = ['open']
    if ENV['BOARD_TEST_BRIDGE_SOCKET']
      open_args += ['--env', "BOARD_TEST_BRIDGE_SOCKET=#{ENV['BOARD_TEST_BRIDGE_SOCKET']}"]
    end
    open_args << BOARD_APP

    opened = false
    3.times do
      opened = system(*open_args)
      break if opened
      sleep 0.5
    end
    raise "\"open #{BOARD_APP}\" a échoué après 3 essais" unless opened

    wait_until(desc: -> { 'btn-add-project introuvable après ouverture de Board.app' }) { exists?('btn-add-project') }
  end

  def quit_app
    system('pkill', '-x', 'Board', out: File::NULL, err: File::NULL)
  end

  def read_app_data
    wait_until(desc: -> { "#{APP_DATA_FILE} jamais apparu" }) { File.exist?(APP_DATA_FILE) }
    YAML.safe_load(File.read(APP_DATA_FILE))
  end

  def write_app_data(data)
    File.write(APP_DATA_FILE, data.to_yaml)
  end

  def read_project_card(project_id)
    YAML.safe_load(File.read(project_card_path(project_id)))
  end

  def project_card_path(project_id)
    File.join(PROJECT_CARD_FOLDER, "#{project_id}.yaml")
  end

  # Hash de service "open-folder-project" déjà attaché, au format persisté
  # (params dans l'ordre lu par backend/scripts/OpenFolderProject.scpt :
  # chemin, x, y, w, h, sidebarWidth, view, showSidebar). Pour
  # create_fixture_project(services: {'startup' => [], 'others' => [...]}) —
  # évite de repasser par le glisser-déposer quand ce n'est pas l'objet du
  # test (cf. Tests/specs/e2e/attribution_service.rb pour ce cas-là).
  def fixture_open_folder_service(path, name: 'Ouvrir projet A', type: 'others')
    {
      'id' => 'open-folder-project',
      'uuid' => "fixture-service-#{Time.now.to_i}#{rand(36**4).to_s(36)}",
      'type' => type,
      'scType' => '.scpt',
      'name' => name,
      'params' => [path, 100, 100, 600, 400, 200, 'list view', true],
      'projectId' => nil
    }
  end

  # Service custom "open-file" (Ouvrir le fichier…, ServiceData.js) déjà
  # attaché — params : [path, logiciel]. logiciel: 'none' -> pas
  # d'application précisée (backend/scripts/OpenFile.sh fait juste "open
  # path"), sinon "open -a logiciel path".
  def fixture_open_file_service(path, logiciel, name: 'Ouvrir un fichier', type: 'others')
    {
      'id' => 'open-file',
      'uuid' => "fixture-service-#{Time.now.to_i}#{rand(36**4).to_s(36)}",
      'type' => type,
      'scType' => '.sh',
      'name' => name,
      'params' => [path, logiciel],
      'projectId' => nil
    }
  end

  # Même forme de params que open-folder-project (paramsOrder identique,
  # ServiceData.js) mais ouvre N'IMPORTE QUEL dossier, pas forcément celui du
  # projet — utile pour distinguer les deux dans un même test.
  def fixture_open_finder_window_service(path, name: 'Ouvrir un dossier', type: 'others')
    {
      'id' => 'open-finder-window',
      'uuid' => "fixture-service-#{Time.now.to_i}#{rand(36**4).to_s(36)}",
      'type' => type,
      'scType' => '.scpt',
      'name' => name,
      'params' => [path, 100, 100, 600, 400, 200, 'list view', true],
      'projectId' => nil
    }
  end

  # backend/scripts/RunScript.rb exécute réellement le script selon son
  # extension (.rb -> ruby, .py -> python3, .sh -> bash, sinon "open"). Écrit
  # marker_value dans un fichier (effet persistant et vérifiable), plutôt que
  # de compter sur le message affiché à l'écran (transitoire, pas fiable à
  # attraper au vol) — cf. Tests/specs/e2e/execution_services_startup.rb.
  def create_fixture_run_script(dir, marker_value = 'run-script-executed')
    script_path = File.join(dir, 'test_run_script.rb')
    output_path = File.join(dir, 'output.txt')
    File.write(script_path, <<~RUBY)
      File.write(#{output_path.inspect}, #{marker_value.inspect})
    RUBY
    script_path
  end

  def fixture_run_script_output_path(script_path)
    File.join(File.dirname(script_path), 'output.txt')
  end

  def fixture_run_script_service(script_path, name: 'Jouer un script', type: 'others')
    {
      'id' => 'run-script',
      'uuid' => "fixture-service-#{Time.now.to_i}#{rand(36**4).to_s(36)}",
      'type' => type,
      'scType' => '.rb',
      'name' => name,
      'params' => [script_path, File.basename(script_path)],
      'projectId' => nil
    }
  end

  # Crée directement une carte projet sur disque + l'enregistre dans
  # appdata.json (projects-in), sans passer par l'UI. Ne rend PAS le projet
  # visible dans une app déjà lancée : appeler launch_app après, pour que
  # Board recharge sa liste de projets au démarrage.
  def create_fixture_project(title:, path: Dir.tmpdir, **extra)
    id = "fixture-#{Time.now.to_i}#{rand(36**4).to_s(36)}"
    data = {
      'id' => id,
      'title' => title,
      'path' => path,
      'workTime' => 0,
      'services' => { 'startup' => [], 'others' => [] }
    }.merge(extra.transform_keys(&:to_s))

    FileUtils.mkdir_p(PROJECT_CARD_FOLDER)
    File.write(project_card_path(id), data.to_yaml)

    app_data = read_app_data
    app_data['projects-in'] ||= []
    app_data['projects-in'] << id unless app_data['projects-in'].include?(id)
    write_app_data(app_data)

    id
  end

  # Même chose que create_fixture_project, mais le projet est directement
  # placé dans projects-out (archivé) plutôt que projects-in.
  def create_fixture_archived_project(title:, path: Dir.tmpdir, **extra)
    id = create_fixture_project(title: title, path: path, **extra)
    app_data = read_app_data
    app_data['projects-in']&.delete(id)
    app_data['projects-out'] ||= []
    app_data['projects-out'] << id unless app_data['projects-out'].include?(id)
    write_app_data(app_data)
    id
  end

  # Retire complètement une carte projet fixture (fichier + entrée
  # appdata.json, in ou out) — nettoyage de fin de test.
  def remove_fixture_project(project_id)
    File.delete(project_card_path(project_id)) if File.exist?(project_card_path(project_id))
    app_data = read_app_data
    app_data['projects-in']&.delete(project_id)
    app_data['projects-out']&.delete(project_id)
    write_app_data(app_data)
  end
end
