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

