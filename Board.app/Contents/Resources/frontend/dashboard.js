window.onload = function(ev){
  message("Fenêtre chargé.")
  message("Chargement des travaux courants…")
  server.send({action: "load"}, dispatchWorks.bind(null))
}

function dispatchWorks(retour){
  message("Travaux courants chargés.")
  feedback(retour)
}