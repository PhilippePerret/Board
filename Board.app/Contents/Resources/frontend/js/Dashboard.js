
function loadCurrentProjects(){
  message("Chargement des travaux courants…")
  server.send({action: "load", what: 'projects'}, Project.dispatch.bind(Project))
}