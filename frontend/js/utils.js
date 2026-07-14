/**
 * Utilisation 
 * const fonction = debounce( (arg) => {
 *  // opération
 * }, delai_mms)
 */
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function textSubstitute(msg, params){
  if (params) {
    if (Array.isArray(params)) {
      var i = 0
      params.forEach( param => {
        i++
        const regexp = new RegExp(`\\$\\{?${i}\\}?`, 'g')
        msg = msg.replace(regexp, param)
      })
    } else if ('object' == typeof params) {
      for(var key in params){
        const regexp = new RegExp(`\\$\\{?${key}\\}?`, 'g')
        msg = msg.replace(regexp, params[key])
      }
    } else {
      msg = msg.replace(/\$1/g, String(params))
    }
  }
  return msg
}

// Pour retirer le scrimmage (quand on veut voir derrière)
function unScrim(scrim){
  scrim.style = "backdrop-filter: none; background: rgba(0,0,0,0.1);"
}

// Historique
function historize(msg, params) {
  if (undefined == window.HISTORIQUE) window.HISTORIQUE = []
  if (params) {
    console.log("%c" + msg, 'color: #b9b9b9;', params)
    window.HISTORIQUE.push([msg, params])
  } else {
    console.log("%c" + msg, 'color: #b9b9b9;')
    window.HISTORIQUE.push(msg)
  }
}

function jsonize(data){
  return JSON.stringify(data)
}
function message(msg){
  document.querySelector('#message').innerHTML = '<span class="notice">' + msg + '</span>'
  return true
}
function error(msg){
  document.querySelector('#message').innerHTML = '<span class="error">' + msg + '</span>'
  return false
}

function raise(msg){
  throw new Error(msg)
}

// 'mon-change-on' => MonChangeOn
function kebabToPascalCase(str) {
  return str.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('')
}

function heureCourante(withSeconds = true){
  const now = new Date()
  const h = now.getHours()
  const m = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  let heure = `${h}:${m}`
  withSeconds && heure.concat(`:${s}`)
  return heure
}

// À appeler avant toute opération
function reset(){
  message("")
}

