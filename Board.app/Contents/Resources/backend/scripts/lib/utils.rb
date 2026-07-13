require 'json'
require 'fileutils'

def ensure_folder(*args)
  path = File.join(*args)
  FileUtils.mkdir_p(path)
  return path
end

def inited_table
  {ok: true, error: nil, message: nil}
end