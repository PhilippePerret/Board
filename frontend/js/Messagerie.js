/**
 * MODULE MESSAGERIE
 * 
 * Gère tout ce qui relève des messages
 * (à part les notifications — cf. Notifier.js)
 * 
 */

function raiseError(errId, params){
  error(errId, params)
  throw new Error()
}

// Retourne une erreur de MES_ERRORS.js — undefined si errId n'est pas une
// clé connue. Nécessaire pour Dialogs.js#normalizeErrors, qui fait
// `getErr(error) || error` en supposant que error est SOIT un texte brut
// SOIT un identifiant : ça ne retombe sur le texte brut que si getErr()
// renvoie une valeur fausse pour un id inconnu.
function getErr(errId, params){
  if (!(errId in ERRORS)) return undefined
  return textSubstitute(ERRORS[errId], params)
}

// Retourne un message localisé de MES_MESSAGES.js
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
    if( undefined == msg){
      console.info("Aucun message envoyé.")
      return
    }
    if (msg != "") {
      msg = textSubstitute(msg, params)
    }
    if ( inExergueWindow ) {
      if (message._exergueTimer) clearTimeout(message._exergueTimer)
      message._exergueDiv?.remove()
      const divMsg = DCreate('DIV', {class:'exergue-message', text: msg})
      message._exergueDiv = divMsg
      message._exergueTimer = setTimeout(() => {clearTimeout(message._exergueTimer); divMsg.remove()}, 6000)
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

function footerError(msg, params) {
  msg = getErr(msg, params) || msg
  divMessage().innerHTML = msg
  retarde(() => {nettoie_message()}, 20)
}
function error(msg, params, title){
  msg = getErr(msg, params) ?? msg
  new ErrorsDialog({
      width: '580px'
    , icon:  'images/error.svg'
    , title: title ?? getMsg('fatal-error')
    , errors: msg.split("\n")
  }).show()
  return false
}
function erreur(msg){ return error(msg) }

const nettoie_message = debounce( () => {
  divMessage().innerHTML = ''
}, 10 * 1000)

function divMessage(){
  return this._divmsg || (this._divmsg = DGet('#message'))
}

class Speaking {
  /**
   * @papi
   * 
   * Résolution des messages remontant du backend
   * 
   * @param data {Object} Object remontant du backen et
   *    contenant notamment message et error qui doivent
   *    être évalués en sachant qu'aucune localisation n'est
   *    effectuée en backend.
   * 
   *    La difficulté réside dans la souplesse offerte au backend 
   *    pour remonter tout type de messages, depuis le message simple
   *    jusqu'aux messages accumulés comportant des variables à 
   *    injecter. Toutes ces formes sont décrites ci-dessous et trai-
   *    tées
   *    NOTE : msgId est indifféremment un id de MESSAGES ou un id e
   *    ERRORS.
   * 
   *    - null/undef    Aucun message
   *    - msgId         Simple identifiant à évaluer
   *    - [msgId, val]  Simple identifiant avec valeur simple
   *    - [msgId, [valeurs]]  Simple idenfiant et liste de valeurs
   *    - [ [identifants] ]   Liste d'identifiants sans valeur
   *    - [ [identifiants], val]  Liste d'identifiants avec une valeur
   *    - [ [identifiants], [valeurs]] Liste d'identifiants avec plusieurs valeurs
   * 
   * ATTENTION : Il me semble que j'ai autorisé de faire : 
   *      [ [msgId, valeur], [msgId, valeur], [msgId, valeur], ...]
   * Mais s'il y a seulement 2 valeurs (ce que je ne peux pas 
   * contrôler), alors il y aura ambiguïté avec :
   *      [ [msgId, msgId], [valeur, valeur] ]
   * Pour faire la différence, il faudrait être sûr que ce sont bien
   * des msgId qui sont envoyés mais c'est impossible à assurer. 
   * Donc il faudrait interdire cette tournure.
   * TODO : la rechercher dans les messages backend
   */
  static resolveBackendMessages(data){
    data.error    = this._resolveMessagesIn(data.error, ERRORS)
    data.message  = this._resolveMessagesIn(data.message, MESSAGES)
  }
  static _resolveMessagesIn(msg, Ensemble){
    if (undefined == msg || msg == null) return null
    else if ('string' == typeof msg) {
      return Ensemble[msg] ?? msg
    } else if (Array.isArray(msg)) {
      if ( msg.length > 2) {
        // <= plus de 2 valeurs root
        // => C'est une erreur, on considère que c'est une
        //    liste de messages ratés, sans valeur.
        msg = [msg]
      }
      var msgIds = []
      if ('string' == typeof msg[0]) {
        // identifiant unique de message
        msgIds = [msg[0]]
      } else if (Array.isArray(msg[0])) {
        // <= liste d'identifiants de messages
        msgIds = msg[0]
      }
      var values
      if (undefined == msg[1]) {
        values = undefined
      } else if (Array.isArray(msg[1])) {
        values = msg[1]
      } else {
        values = [ msg[1] ]
      }
      // On évalue tous les messages
      return msgIds.reduce((accu, msgId) => {
        const msg = Ensemble[msgId] ?? msgId
        accu.push(textSubstitute(msg, values))
        return accu
      }, []).join("\n")

    } else {
      // Autre chose qu'un strin et qu'un array ?… Je ne vois pas
      return msg
    }
  }
}

