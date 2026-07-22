# Écriture du changelog et de la todo-list du projet (fin de séance
# d'horloge, service commun "work-clock") — ajout en tête de fichier, en
# gardant le contenu déjà là. Crée le fichier s'il n'existe pas.

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
