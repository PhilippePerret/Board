function feedback(message){
  document.getElementById("output").textContent = message;  
}

window.server = {
  /* Fonction API */
  send(data, callback){
    bridge.call(
      data,
      (response) => {
        console.log("response", response)
        if (response.ok) {
            callback(response)
        } else {
            error(response.error)
        }
        // feedback(reponse)
      }
    );
  }
}

window.bridge = {
    _callbacks: {},

    __send(payload) {
        this._payload = payload // pour erreurs
        // console.log("payload", payload)
        window.webkit.messageHandlers.bridge.postMessage(payload);
    },

    receive(jsonString) {
        let data = null;

        try {
            data = JSON.parse(jsonString);
        } catch (e) {
            console.error("Invalid JSON from backend:", jsonString);
            console.error("Erreur avec la requête : ", this._payload)
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