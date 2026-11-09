require 'json'
begin
  table = {ok: true, message: nil, error: nil}

  MAIN_FILE_PATH = ARGV[0]
  MAIN_FILE_NAME = File.basename(MAIN_FILE_PATH)
  FOLDER_MAIN_FILE = File.dirname(MAIN_FILE_PATH)
  # asciidoctor du Ruby embarqué dans l'app, jamais celui de l'ordinateur
  asciidoctor = "'#{RbConfig.ruby}' '#{Gem.bin_path('asciidoctor', 'asciidoctor')}'"
  epub        = "'#{RbConfig.ruby}' '#{Gem.bin_path('asciidoctor-epub3', 'asciidoctor-epub3')}'"
  cmd       = "cd '#{FOLDER_MAIN_FILE}' && #{asciidoctor} --failure-level=WARN "
  cmd_epub  = "cd '#{FOLDER_MAIN_FILE}' && #{epub} --failure-level=WARN "
  
  MACROS_FILE = File.join(FOLDER_MAIN_FILE, 'macros.rb')
  if File.exist?(MACROS_FILE)
    cmd       += "-r ./macros.rb "
    cmd_epub  += "-r ./macros.rb "
  end
  
  CSS_FILE    = File.join(FOLDER_MAIN_FILE, 'custom.css')
  if File.exist?(CSS_FILE)
    # Attention : cela remplace complètement la mise en forme
    cmd += "-a stylesheet=custom.css "
  end
  
  cmd       += "#{MAIN_FILE_NAME}"
  cmd_epub  += "#{MAIN_FILE_NAME}"

  table[:command] = cmd

  res = `#{cmd} 2>&1`
  status = $?
  if status.success?
    # Production de l'EPUB, par défaut, après le HTML
    table[:command_epub] = cmd_epub
    res += `#{cmd_epub} 2>&1`
    status = $?
  end
  if status.success?
    table[:ok] = true
    table[:message] = res
  else
    table[:ok] = false
    # On va épurer le message avant de l'envoyer
    res = res.gsub(/asciidoctor:/, '')
      .gsub(/(ERROR|WARNING)/, "\n\\1")
    table[:error] = res
  end

rescue Exception => e
  table[:ok] = false
  table[:error] = e.message
end

puts table.to_json