window.onload = function(ev){
  message("Fenêtre chargé.")
  loadCurrentProjects()

  // POUR ESSAI
  const projet = new Project({title: "Mon tout premire projet"})
  projet.buildCard()
}

function loadCurrentProjects(){
  message("Chargement des travaux courants…")
  server.send({action: "load"}, dispatchWorks.bind(null))
}

function dispatchWorks(retour){
  message("Travaux courants chargés.")
  feedback(JSON.stringify(retour))
}