/**
 * Retourne un lien vers l'aide
 * 
 * TODO à implémenter
 */
function aide(key, mark, file) {
  return Aide.link(key, mark, file)
}

class Aide {
  static open(anchor, fichier) { D.on && D.trace(anchor, fichier)
    fichier = fichier || 'Manuel.html' 
    if ( anchor && anchor == '') anchor = undefined
    window.webkit.messageHandlers.openHelp.postMessage({fichier, anchor})
  }

  static link(anchor, mark = '?', file = ''){
    return `<button class="aide" data-file="${file}" data-anchor="${anchor}" onclick="return Aide.openAideByLink.call(Aide, event, this)">${mark}</button>`
  }
  static openAideByLink(ev, btn){ D.on && D.trace(ev, btn)
    console.log("-> openAideByLink", btn)
    stopEvent(ev)
    this.open(btn.dataset.anchor, btn.dataset.file)
    return false
  }
}
