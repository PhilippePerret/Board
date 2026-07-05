require "json"

begin

  returned_error  = nil
  error = nil
  returned_data   = nil
  
  
  # La requête frontend se trouve dans cette requête qui est une
  # table JSON
  input = STDIN.read.strip
  request = JSON.parse(input)
  
  # ID de la requête (pour suivi)
  request_id = request["id"]

  #######################################
  ###       Analyse de l'ACTION       ###
  #######################################
  case request["action"]

  when "load"
    returned_message = "Données chargées"
    returned_data     = {projet: "Mon projet"}
    ok = true

  # Lancement d'un script osascript
  when "run-osascript"
    begin
      ok = true
      res = `osascript 'scripts/#{request["script-name"]}.scpt'`.strip
      returned_message = res
      returned_data = JSON.parse(res)
    rescue Exception => e
      ok = false
      returned_error = e.message
    end
    
  when "workday"
    # C'était l'essai pourri ChatGPT
    app = request["app"]
    
    returned_message = "Environnement prêt pour #{app}"
    ok = true
    

  else # action inconnue
    ok = false
    returned_error = "unknown action: #{request["action"]}"

  end
  
  ###########################################
  ###   La table JSON retournée au front  ###
  ###########################################
  puts ({
    ok:       ok,
    id:       request_id,
    message:  returned_message,
    error:    error || returned_error,
    data:     returned_data,
    received_request:  request
  }.to_json)

rescue => e
  puts({ ok: false, id: nil, error: e.message }.to_json)

end
