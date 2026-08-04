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

case ope
when 'commit'
  res = Git.commit(project_path: pat, files: ARGV[2], message: ARGV[3])
else
  data[:error] = "Opération inconnue : #{ope.inspect}"
end

data[:ope]      = ope
data[:path]     = pat
data[:message]  = "je suis passé par GitOpes.rb pour jouer #{ope.inspect} sur le projet #{pat.inspect}. Résultat : #{res.inspect}"
data[:res]      = res

puts data.to_json