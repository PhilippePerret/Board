
function getErr(errId, params){
  return textSubstitute(ERRORS[errId], params)
}

function getMsg(msgId, params){
  return textSubstitute(MESSAGES[msgId], params)
}

function message(msg, params){
  msg = textSubstitute(msg, params)
  document.querySelector('#message').innerHTML = '<span class="notice">' + msg + '</span>'
  return true
}

function error(msg, params){
  msg = textSubstitute(msg, params)
  document.querySelector('#message').innerHTML = '<span class="error">' + msg + '</span>'
  return false
}
function erreur(msg){ return error(msg) }
