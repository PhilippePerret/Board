require 'json'
require 'pathname'

PROJECT_FOLDER   = ARGV[0]
EXCLUDED_FOLDERS = (ARGV[1] || '').split(',').map(&:strip).reject(&:empty?)
ALWAYS_EXCLUDED  = ['.git', 'node_modules', 'vendor']

table = {ok: true, message: nil, error: nil}

unless Dir.exist?(PROJECT_FOLDER)
  table[:ok] = false
  table[:error] = ['backend-search-project-unfound-folder', PROJECT_FOLDER]
  puts table.to_json
  exit
end

excluded_names = EXCLUDED_FOLDERS + ALWAYS_EXCLUDED

# Comptage par extension, pour un classement des plus courantes en tête
# (cf. demande Phil 2026-08-30) plutôt qu'un tri alphabétique brut.
counts = Hash.new(0)
Dir.glob(File.join(PROJECT_FOLDER, '**', '*')).each do |file|
  next unless File.file?(file)
  relative_path = Pathname.new(file).relative_path_from(Pathname.new(PROJECT_FOLDER)).to_s
  next if relative_path.split(File::SEPARATOR).any? { |part| excluded_names.include?(part) }
  ext = File.extname(file)
  counts[ext] += 1 unless ext.empty?
end

table[:extensions] = counts.sort_by { |ext, n| [-n, ext] }.map(&:first)
puts table.to_json
