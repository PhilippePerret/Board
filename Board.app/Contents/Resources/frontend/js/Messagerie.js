
function getErr(errId, params){
  return textSubstitute(ERRORS[errId], params)
}

function getMsg(msgId, params){
  return textSubstitute(MESSAGES[msgId], params)
}