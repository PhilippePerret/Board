require 'json'
begin
  table = {ok: true, message: nil, error: nil}

  MAIN_FILE_PATH = ARGV[0]
  MAIN_FILE_NAME = File.basename(MAIN_FILE_PATH)
  FOLDER_MAIN_FILE = File.dirname(MAIN_FILE_PATH)
  MACROS_FILE = File.join(FOLDER_MAIN_FILE, 'macros.rb')
  cmd = "cd '#{FOLDER_MAIN_FILE}' && /opt/homebrew/bin/asciidoctor "
  if File.exist?(MACROS_FILE)
    cmd += "-r ./macros.rb "
  end
  cmd += "#{MAIN_FILE_NAME}"
  table[:command] = cmd

  res = `#{cmd} 2>&1`
  table[:message] = res

rescue Exception => e
  table[:ok] = false
  table[:error] = e.message
end
puts table.to_json