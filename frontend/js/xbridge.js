function feedback(message){ D.on && D.trace() 
  document.getElementById("output").textContent = message;  
}

window.server = {
  /* Fonction API */
  send(data, callback){ D.on && D.trace([data, callback])
    bridge.call(
      data,
      (response) => {
        // console.log("response", response)
        if (response.ok) {
            callback && callback(response)
        } else {
            error(response.error)
        }
        // feedback(reponse)
      }
    );
  }
}

window.bridge = {
    callbacks: {},

    __send(payload) { D.on && D.trace(payload)
        this._payload = payload // pour erreurs
        // console.log("payload", payload)
        window.webkit.messageHandlers.bridge.postMessage(payload);
    },

    receive(jsonString) { D.on && D.trace(jsonString)
        let data = null;

        try {
            data = JSON.parse(jsonString);
        } catch (e) {
            console.error("Invalid JSON from backend:", jsonString);
            console.error("Erreur avec la requête : ", this._payload)
            return;
        }
        const id = data.id;

        if (id && this.callbacks[id]) {
            this.callbacks[id](data);
            delete this.callbacks[id];
        }

        // fallback global handler
        if (this.onMessage) {
            this.onMessage(data);
        }
    },

    call(payload, callback) { D.on && D.trace([payload, callback])
        const id = Date.now() + Math.random().toString(16).slice(2);
        payload.id = id;
        if (callback) { this.callbacks[id] = callback }
        this.__send(payload);
    }
};