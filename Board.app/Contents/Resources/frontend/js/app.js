window.onload = function(ev){
  message("Fenêtre chargé.")
  loadCurrentProjects()
  essayer()
}

function jaiDitOui(){
  message("Il a dit oui")
}
function jaiDitNon(){
  message("Il a dit non")
}
function jaiDitPeutetre(){
  message("Il a dit peut-être")
}

function jsonize(data){
  return JSON.stringify(data)
}


function essayer(){
  const conf = new ConfirmDialog({
    title: "Confirmation", 
    message: "Sélectionner le dossier du projet dans le Finder, puis cliquer “OK”.",
    width: '580px',
    ouiBtn: {title: 'OK', onclick: jaiDitOui.bind(self), width: '160px'},
    nonBtn: {title: "Renoncer", onclick: jaiDitNon.bind(self), width: '160px'},
    midBtn: {title: "Pour voir", onclick: jaiDitPeutetre.bind(self), width: '160px'}
  })
  conf.show()
  error("Une erreur volontaire")
}

function onRetourEssai(retour){
  message("-> onRetourEssai")
  feedback(retour)
}


function message(msg){
  document.querySelector('#message').textContent = msg
}
function error(msg){
  document.querySelector('#message').innerHTML = '<span class="error">' + msg + '</span>'
}

/*
// optionnel : handler global
bridge.onMessage = (msg) => {
    console.log("Message backend:", msg);
};
//*/