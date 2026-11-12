# Écriture du changelog et de la todo-list du projet (fin de séance
# d'horloge, service commun "work-clock") — ajout en tête de fichier, en
# gardant le contenu déjà là. Crée le fichier s'il n'existe pas.

def update_project_notes(request)
  project_dir    = request['path']
  changelog_text = request['changelog']
  todo_text      = request['todo']
  Debug.log("update-project-notes reçu, path=#{project_dir.inspect} changelog=#{changelog_text.inspect} todo=#{todo_text.inspect}")

  if changelog_text && !changelog_text.strip.empty?
    changelog_file = File.join(project_dir, 'CHANGELOG.md')
    existed  = File.exist?(changelog_file)
    existing = existed ? IO.read(changelog_file) : ''
    header   = existed ? '' : "# Changelog\n\n"
    date     = Time.now.strftime('%Y/%m/%d')
    entry    = "## #{date}\n\n#{changelog_text.strip}\n\n"
    IO.write(changelog_file, header + entry + existing)
  end

  if todo_text && !todo_text.strip.empty?
    todo_file = File.join(project_dir, 'TODO.md')
    existed  = File.exist?(todo_file)
    existing = existed ? IO.read(todo_file) : ''
    header   = existed ? '' : "# Todo list\n\n"
    lines    = todo_text.strip.split("\n").map(&:strip).reject(&:empty?)
    entry    = lines.map { |l| "- [ ] #{l}" }.join("\n") + "\n\n"
    IO.write(todo_file, header + entry + existing)
  end

  RETOUR.ok = true
end

# Nombre de tâches à faire d'un projet (pastille todo) : cases non cochées
# du fichier todo + issues GitHub ouvertes de label "todo".
def count_project_todos(request)
  require 'json'
  require 'open3'
  require 'timeout'
  project_dir = request['path']
  todo_file   = File.join(project_dir, request['todo_file'] || 'TODO.md')
  file_count  = File.exist?(todo_file) ? IO.read(todo_file).scan(/^\s*[-*] \[ \]/).count : 0
  gh_count    = 0
  if request['github'] && File.exist?(File.join(project_dir, '.git'))
    begin
      out = Timeout.timeout(8) do
        Open3.capture2('gh', 'issue', 'list', '--label', 'todo', '--state', 'open', '--json', 'number', chdir: project_dir)[0]
      end
      gh_count = JSON.parse(out).count
    rescue Exception => e
      Debug.log("count-todos : gh indisponible pour #{project_dir.inspect} (#{e.message})")
    end
  end
  RETOUR.data = {file: file_count, github: gh_count, total: file_count + gh_count, todo_file: todo_file, file_exists: File.exist?(todo_file)}
  RETOUR.ok = true
end

# Issues GitHub ouvertes de label "todo" du projet, dans le navigateur
def open_todo_issues(request)
  require 'open3'
  _out, err, status = Open3.capture3('gh', 'issue', 'list', '--label', 'todo', '--state', 'open', '--web', chdir: request['path'])
  RETOUR.ok = status.success?
  RETOUR.error = err unless status.success?
end
