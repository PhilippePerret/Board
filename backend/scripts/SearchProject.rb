require 'json'
require 'pathname'

PROJECT_FOLDER   = ARGV[0]
EXCLUDED_FOLDERS = (ARGV[1] || '').split(',').map(&:strip).reject(&:empty?)
EXTENSIONS       = JSON.parse(ARGV[2] || '[]').map { |e| e.start_with?('.') ? e : ".#{e}" }
SEARCH_TEXT      = ARGV[3]

# Toujours exclus, en plus des dossiers choisis par l'user (cf. réponse Phil
# 2026-08-30 : coût du scan sinon prohibitif sur un gros node_modules, et
# vendor/ pollue avec des dépendances embarquées type Ruby/pages de man).
ALWAYS_EXCLUDED = ['.git', 'node_modules', 'vendor']

table = {ok: true, message: nil, error: nil}

unless Dir.exist?(PROJECT_FOLDER)
  table[:ok] = false
  table[:error] = ['backend-search-project-unfound-folder', PROJECT_FOLDER]
  puts table.to_json
  exit
end

begin
  regex = Regexp.new(SEARCH_TEXT)
rescue RegexpError => e
  table[:ok] = false
  table[:error] = ['backend-search-invalid-regex', [SEARCH_TEXT, e.message]]
  puts table.to_json
  exit
end

excluded_names = EXCLUDED_FOLDERS + ALWAYS_EXCLUDED

results = []
Dir.glob(File.join(PROJECT_FOLDER, '**', '*')).sort.each do |file|
  next unless File.file?(file)
  relative_path = Pathname.new(file).relative_path_from(Pathname.new(PROJECT_FOLDER)).to_s
  next if relative_path.split(File::SEPARATOR).any? { |part| excluded_names.include?(part) }
  next unless EXTENSIONS.empty? || EXTENSIONS.include?(File.extname(file))
  begin
    File.readlines(file).each_with_index do |line, idx|
      results << {path: file, file: relative_path, line: idx + 1, excerpt: line.strip} if line.match?(regex)
    end
  rescue ArgumentError
    next # fichier binaire (encodage invalide) : ignoré
  end
end

table[:results] = results
table[:message] = ['backend-search-done', [results.length]]

puts table.to_json
