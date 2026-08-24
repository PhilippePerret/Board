require_relative '../lib/usefull.rb'
require_relative '../lib/git.rb'

data = {
  ok:       true,
  error:    nil,
  message:  nil,
  ope:      nil,
  res:      nil
}


ope = ARGV[0]
pat = ARGV[1]
res = nil

begin
  case ope
  when 'commit'
    res = Git.commit(project_path: pat, files: ARGV[2], message: ARGV[3])
  when 'update_labels'
    res = Git.update_labels(project_path: pat, labels: ARGV[2])
  else
    data[:error] = ['backend-git-unknown-ope', ope.inspect]
  end
  if res.is_a?(Hash) && res[:ok] == false
    data[:ok] = false
    data[:error] = res[:error]
  end
rescue Exception => e
  data[:ok] = false
  data[:error] = e.message
end

data[:ope]      = ope
data[:path]     = pat
data[:res]      = res

puts data.to_json