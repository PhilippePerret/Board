/**
 * Retourne un lien vers l'aide
 * 
 * TODO à implémenter
 */
function aide(key) {
  return `[Lien vers aide '${key}']`
}

// Pour faire Object.isObject(obj)
Object.isObject = obj => Object.getPrototypeOf(obj) === Object.prototype;

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

/**
 * Remplacer les $1…$X dans le template +msg+
 */
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
  msg = msg.replace(/\n/g, '<br>')
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

function uniqId(){
  return Date.now() + Math.random().toString(16).slice(2);
}

function jsonize(data){
  return JSON.stringify(data)
}

function raise(msg, params){
  if (params) {console.error(msg, params)}
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



function reset(){
  message("")
}


/**
 * https://icons.getbootstrap.com
 * Et mettre l'image dans frontend/images
 */
function svg(root, type){
  var v = 32
  switch(type){
    case 'button': case 'btn':
      w = 24
      break
    default:
      w = 32
  }
  return `<img src="images/${root}.svg" style="width:${w}px;vertical-align:middle;margin-right:8px;"> `
}