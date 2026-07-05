function feedback(message){
  document.getElementById("output").textContent = message;  
}

window.server = {
  /* Fonction API */
  send(data, callback){
    bridge.call(
      data,
      (response) => {
        var reponse = response.ok ? 'OK' : 'Erreur'
        reponse += "\n" + JSON.stringify(response, null, 2);        
        // feedback(reponse)
        callback(reponse)
      }
    );
  }
}

window.bridge = {
    _callbacks: {},

    __send(payload) {
        window.webkit.messageHandlers.bridge.postMessage(payload);
    },

    receive(jsonString) {
        let data = null;

        try {
            data = JSON.parse(jsonString);
        } catch (e) {
            console.error("Invalid JSON from backend:", jsonString);
            return;
        }
        const id = data.id;

        if (id && this._callbacks[id]) {
            this._callbacks[id](data);
            delete this._callbacks[id];
        }

        // fallback global handler
        if (this.onMessage) {
            this.onMessage(data);
        }
    },

    call(payload, callback) {
        const id = Date.now() + Math.random().toString(16).slice(2);
        payload.id = id;
        this._callbacks[id] = callback;
        this.__send(payload);
    }
};