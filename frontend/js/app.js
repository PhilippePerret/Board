window.onload = function(ev){
  message("Fenêtre chargé.")
  loadCurrentProjects()
  // essayer()
}

// À appeler avant toute opération
function reset(){
  message("")
}

function jsonize(data){
  return JSON.stringify(data)
}


function essayer(){
}

function onRetourEssai(retour){
  message("-> onRetourEssai")
  feedback(retour)
}


function message(msg){
  document.querySelector('#message').textContent = msg
  return true
}
function error(msg){
  document.querySelector('#message').innerHTML = '<span class="error">' + msg + '</span>'
  return false
}

function raise(msg){
  throw new Error(msg)
}