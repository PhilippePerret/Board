function essayer(){
  message("Essai pour voir")
  server.send({
    action:'run-osascript', 
    'script-name': "finder-front-window-infos"
    }, onRetourEssai
  )
}

function onRetourEssai(retour){
  message("-> onRetourEssai")
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