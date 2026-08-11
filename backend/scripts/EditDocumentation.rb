require 'json'

DOCU_FOLDER = ARGV[0]
EDITOR_NAME = ARGV[1]

table = {ok: true, message: nil, error: nil}

if File.exist?(DOCU_FOLDER)
  if EDITOR_NAME.nil? || EDITOR_NAME.strip.empty?
    `open "#{DOCU_FOLDER}"`
  else
    `open -a "#{EDITOR_NAME}" "#{DOCU_FOLDER}"`
  end
  table[:message] = ['backend-docu-opened-in', EDITOR_NAME]
else
  table[:ok] = false
  table[:error] = ['backend-docu-unfound-folder', DOCU_FOLDER]
end

puts table.to_json