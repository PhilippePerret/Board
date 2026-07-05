window.onload = function(ev){
  message("Fenêtre chargé.")
  loadCurrentProjects()
}

function loadCurrentProjects(){
  message("Chargement des travaux courants…")
  server.send({action: "load", what: 'projects'}, Project.dispatch.bind(Project))
}