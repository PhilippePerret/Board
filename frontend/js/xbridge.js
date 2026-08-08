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
        // Double rAF pour laisser WebKit peindre l'état déjà à jour du DOM
        // (dialog fermé, spinner lancé…) avant que le pont Swift ne bloque
        // le thread principal le temps du process Ruby — un setTimeout(0)
        // seul ne garantit pas qu'un vrai repaint ait eu lieu entre-temps.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                window.webkit.messageHandlers.bridge.postMessage(payload);
            });
        });
    },

    receive(jsonString) { D.on && D.trace(jsonString)
        let data = null;

        try {
            data = JSON.parse(jsonString);
        } catch (e) {
            erreur('app-sorry-fatal-error')
            console.error("Invalid JSON from backend:", jsonString)
            console.error("[SYSTEM] Erreur avec la requête : ", this._payload)
            return
        }
        const id = data.id

        // Résolution des messages localisés remontant du
        // backend (sous forme d'identifiants)
        Speaking.resolveBackendMessages(data)

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