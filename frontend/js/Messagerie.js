/**
 * MODULE MESSAGERIE
 * 
 * Gère tout ce qui relève des messages (dans l'app et notification)
 */

class Notifier {
  
  /**
   * +data+ contient :
   * mode         Type de fenêtre
   *              modal     : elle bloque tout jusqu'à être fermée
   *              floating  : elle flotte au-dessus
   * message      Le message à afficher
   * title        Titre surmontant le message
   * icon         Icône accompagnant le message 
   *              Soit un path d'image existante
   *              Soit un nom 'warning', 'notice', 'error'
   * delay        Délai avant fermeture de la fenêtre
   * bounds       Position et dimension de la fenêtre
   *              {position: [left, top], size: [width, height]}
   * size         Dimension [width, height] de la fenêtre
   * position     Position [left, top] de la fenêtre
   * buttons      Les boutons à afficher
   *              Liste de {name: "label", value: "lab1", onclick: callback}
   *              Si 'value' n'est pas transmis, c'est :name
   *              Dans ce cas, 
   */
  static notify(data){
    this.data = this._ensure_data(data)
    window.server.send(this.data, this.onClick.bind(this))
  }
  static onClick(btnValue){
    const btn = this.getButton(btnValue)
    if (btn && 'function' == typeof btn.onclick) btn.onclick()
  }

  // Retourne les données du bouton du valeur +btnValue+
  static getButton(btnValue){
    return this.dataButtons[btnValue]
  }

  // Conformise les données qui doivent être envoyées
  static _ensure_data(data){
    
    /* -- Les boutons -- */
    this.dataButtons = {}
    if (data.buttons) {
      const swiftButtons = data.buttons.map(dbutton => {
        value = dbutton.value || dbutton.name
        Object.assign(this.dataButtons, {[value]: dbutton})
        return [dbutton.name, value]
      })
      Object.assign(data, {buttons: swiftButtons})
    }

    var [width, height] = data.size || (data.bounds?.size) || [180, 40]
    var [left, top] = data.position || data.bounds?.position || [40, 40]

    Object.assign(data, {bounds: {position: [left, top], size: [width, left]}})

    this.data = data
  }
}

function getErr(errId, params){
  return textSubstitute(ERRORS[errId], params)
}

function getMsg(msgId, params){
  return textSubstitute(MESSAGES[msgId], params)
}

function message(arg1, arg2, arg3){
  var msg, params;
  const inExergueWindow = (arg1 === true)
  if (inExergueWindow) {
    [msg, params] = [arg2, arg3]
  } else {
    [msg, params] = [arg1, arg2]
  }
  try {
    msg || raise("Aucun message envoyé.")
    msg = textSubstitute(msg, params)
    if ( inExergueWindow ) {
      const divMsg = DCreate('DIV', {class:'exergue-message', text: msg})
      var timer = setTimeout(() => {clearTimeout(timer); divMsg.remove()}, 6000)
      document.body.appendChild(divMsg)
    } else {
      divMessage().innerHTML = '<span class="notice">' + msg + '</span>'
      nettoie_message()
    }
    return true
  } catch(err){
    traceError()
    console.error("Erreur avec le message '%s' :", msg, params, err.message)
  }
}

function error(msg, params){
  msg = textSubstitute(msg, params)
  divMessage().innerHTML = '<span class="error">' + msg + '</span>'
  nettoie_message()
  return false
}
function erreur(msg){ return error(msg) }

const nettoie_message = debounce( () => {
  divMessage().innerHTML = ''
}, 10 * 1000)

function divMessage(){
  return this._divmsg || (this._divmsg = DGet('#message'))
}