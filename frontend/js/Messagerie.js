/**
 * MODULE MESSAGERIE
 * 
 * Gère tout ce qui relève des messages
 * (à part les notifications — cf. Notifier.js)
 * 
 */

// Retourne une erreur de MES_ERRORS.js
function getErr(errId, params){
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

