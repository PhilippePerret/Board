
function getErr(errId, params){
  return textSubstitute(ERRORS[errId], params)
}

function getMsg(msgId, params){
  return textSubstitute(MESSAGES[msgId], params)
}

function message(msg, params){
  msg = textSubstitute(msg, params)
  divMessage().innerHTML = '<span class="notice">' + msg + '</span>'
  nettoie_message()
  return true
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