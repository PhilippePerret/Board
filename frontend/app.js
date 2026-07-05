
/**
  Première fonction implémentée
*/
function runWorkday() {
  // Message d'attente
  feedback("Lancement de l'opération…")
  server.send({
    action: "pete un coup"
  })
}

function message(msg){
  document.querySelector('#message').textContent = msg
}
// optionnel : handler global
bridge.onMessage = (msg) => {
    console.log("Message backend:", msg);
};