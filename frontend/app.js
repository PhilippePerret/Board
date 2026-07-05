function jsonize(data){
  return JSON.stringify(data)
}

function essayer(){
  message("Essai pour voir")
  message("PAS D'ESSAI")
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