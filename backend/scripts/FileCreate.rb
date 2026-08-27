require 'fileutils'
require 'json'

table = {ok: true, error: nil, message: nil}

begin
  PROJECT_PATH  = ARGV[0]
  FILE_PATH     = ARGV[1]
  FILE_CONTENT  = ARGV[2] || ''

  full_path = FILE_PATH.start_with?('/') ? FILE_PATH : File.join(PROJECT_PATH, FILE_PATH)

  FileUtils.mkdir_p(File.dirname(full_path))
  File.write(full_path, FILE_CONTENT)

  table[:message] = ['backend-file-created', full_path]
end

puts table.to_json
