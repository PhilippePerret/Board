require 'json'
require 'pathname'

DOCU_FOLDER = ARGV[0]
SEARCH_TYPE = ARGV[1] # 'any', 'target' ([[...]]) ou 'link' (<<...>>)
SEARCH_TEXT = ARGV[2] # expression régulière

# Pour 'target'/'link', la recherche porte sur la partie avant la virgule
# éventuelle (l'identifiant), pas sur le texte affiché du lien.
STRUCT_REGEXES = {'target' => /\[\[([^\]]*)\]\]/, 'link' => /<<([^>]*)>>/}

table = {ok: true, message: nil, error: nil}

unless Dir.exist?(DOCU_FOLDER)
  table[:ok] = false
  table[:error] = ['backend-docu-unfound-folder', DOCU_FOLDER]
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

results = []
Dir.glob(File.join(DOCU_FOLDER, '**', '*.adoc')).sort.each do |file|
  relative_path = Pathname.new(file).relative_path_from(Pathname.new(DOCU_FOLDER)).to_s
  File.readlines(file).each_with_index do |line, idx|
    struct_regex = STRUCT_REGEXES[SEARCH_TYPE]
    matched = struct_regex \
      ? line.scan(struct_regex).any? { |m| m[0].split(',').first.to_s.strip.match?(regex) }
      : line.match?(regex)
    results << {path: file, file: relative_path, line: idx + 1, excerpt: line.strip} if matched
  end
end

table[:results] = results
table[:message] = ['backend-search-done', [results.length]]

puts table.to_json
