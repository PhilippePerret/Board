function essayer(){
  message("j'essayer pour voir")
  server.send({action:'run-osascript', 'script-name': "finder-front-window-infos"}, onRetourEssai.bind(null))
}

function onRetourEssai(retour){
  feedback(retour)
}


function message(msg){
  document.querySelector('#message').textContent = msg
}

/*
// optionnel : handler global
bridge.onMessage = (msg) => {
    console.log("Message backend:", msg);
};
//*/