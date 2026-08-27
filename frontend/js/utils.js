function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Reçoit une valeur et en déduit un type
 *
 * note : un "type" de l'application, par exemple 'file' ou 'boolean
 */
const REG_BOOL = /^true|false$/
const REG_URL  = /^https?::\/\/([a-zA-z0-9\-_#\?]+)$/
const REG_INTEGER = /^[0-9]+$/
const REG_FLOAT = /^[0-9.,]+$/
function getTypeFrom(value) {

  if ('string' == typeof value) {
    if (value.match(REG_BOOL)) {
      return 'boolean'
    } else if (value.match(REG_URL)) {
      return 'url'
    } else if (value.match(REG_FLOAT)) {
      return 'float'
    } else if (value.match(REG_INTEGER)) {
      return 'integer'
    } else if (valueMayBeAPath(value)) {
      return 'path'
    } else {
      return 'string'
    }

  } else {
    return typeof value
  }
}
/**
 * @return TRUE si la +value+ a de fortes chances d'être le
 * chemin d'accès à un fichier.
 */
function valueMayBeAPath(value){
  if ( value.match(/^\.?\//) === null ) return false
  if (value.match(/\n/)) return false
  if (value.split(' ').length < 3)  return true
}

function traceError(){
  console.trace()
}

function formateDate(date, format = '%J %M %Y'){
  return DateUtils.formate(date, format)
}

/**
 * Reçoit un string du type "12 12 2026" et retourne la date
 * correspondante.
 */
function parseDate(dateStr) {
  const res = dateStr.split(/[ \/:.-]/).filter(e => e != '')
  if (res.length != 3 && res.length != 6) return `${dateStr} [date mal formatée]`
  var [jour, mois, annee, heure, minute, seconde] = res.map(e => parseInt(e))
  // console.log("Arguments", [jour, mois, annee, heure, minute, seconde])
  if (String(jour).length == 4) { [jour, annee] = [annee, jour]}
  // console.log("date", jour, mois, annee)
  var args = [annee, mois - 1, jour]
  heure   == undefined || args.push(heure)
  minute  == undefined || args.push(minute)
  seconde == undefined || args.push(seconde)
  // console.log("args", args)
  try {
    return new Date(...args)
  } catch(err) {
    raise(getErr('invalid-date', [dateStr, err.message]))
  }
}
/*
console.log("Date : ", parseDate("2000/12/23 20:12:13"))
//*/


// Pour faire Object.isObject(obj)
Object.isObject = obj => Object.getPrototypeOf(obj) === Object.prototype;

/**
 * Utilisation 
 * const fonction = debounce( (arg) => {
 *  // ... opération ...
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
  try {
    if (! msg) {
      raise("msg non défini dans textSubstitute")
    } else if (typeof msg != 'string') {
      raise("Must be a string")
    } else {
      if (params) {
        if (Array.isArray(params)) {
          params.forEach( (param, i) => {
            const regexp = new RegExp(`\\$\\{?${i + 1}\\}?`, 'g')
            msg = msg.replace(regexp, String(param))
          })
        } else if ('object' == typeof params) {
          for(var key in params){
            const regexp = new RegExp(`\\$\\{?${key}\\}?`, 'g')
            msg = msg.replace(regexp, String(params[key]))
          }
        } else {
          msg = msg.replace(/\$1/g, String(params))
        }
      }
      if (!msg) raise("msg indéfini après traitement des params")
      msg = msg.replace(/(?<!\\)\n/g, '<br>').replace(/\\\n/g, "\n")
    }
  } catch(err) {
    traceError()
    const errMsg = `[textSubstitute] Problème avec msg (${msg}) : ${err.message}`
    console.error(errMsg)
    return errMsg
  }
  return msg
}

// Pour retirer le scrimmage (quand on veut voir derrière)
function unScrim(scrim){
  scrim.style = "backdrop-filter: none; background: rgba(0,0,0,0.1);"
}

// Pour insérer une valeur telle quelle (retours chariot compris) dans une
// commande shell construite par interpolation (ex. beforeExec de service) —
// entoure de guillemets simples, échappe les guillemets simples internes.
function shellEscape(str){
  return `'${String(str).replace(/'/g, `'\\''`)}'`
}

function retarde(method, lapsSeconds){
  var timer = setTimeout(() => {
    clearTimeout(timer)
    timer = null
    method()
  }, lapsSeconds * 1000)
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

// Comme historize, mais pour du log de débogage temporaire (pas le suivi
// du déroulement de l'app pour Phil) — buffer séparé (window.LOGS),
// relisible depuis les tests via bridge_eval, puisqu'une console.log seule
// (process WebContent séparé) n'est jamais capturée par le process Ruby.
function logize(msg, params) {
  if (undefined == window.LOGS) window.LOGS = []
  if (params) {
    console.log("%c" + msg, 'color: #e08a00;', params)
    window.LOGS.push([msg, params])
  } else {
    console.log("%c" + msg, 'color: #e08a00;')
    window.LOGS.push(msg)
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
  const err = new Error(msg)
  if (params) {
    Object.assign(err, {params: params})
  }
  console.error(D.getTraceList()) // Liste des fonctions traversées
  throw err
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


function slugify(str){
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/['’]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
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

/**
 * @return true si la couleur +hex+ est plutôt sombre
 */
function isDark(hex){
  hex = hex.replace(/^#/, '')
  if (hex.length == 3) hex = hex.replace(/./g, c => c + c)
  const r = parseInt(hex.slice(0,2), 16)
  const g = parseInt(hex.slice(2,4), 16)
  const b = parseInt(hex.slice(4,6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) < 128
}