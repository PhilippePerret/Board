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

const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'décembre']
const Mois = MOIS.map(m => {return m[0].toUpperCase() + m.slice(1)})

function formateDate(date, format = '%J %M %Y'){
  if ('string' == typeof date) date = parseDate(date)
  const fyear = String(date.getFullYear())
  return format
    .replace(/\%YY/, fyear[2] + fyear[3])
    .replace(/\%Y/, fyear)
    .replace(/\%_M/, MOIS[date.getMonth()])
    .replace(/\%M/,  String(date.getMonth() + 1).padStart(2, '0'))
    .replace(/\%JJ/, String(date.getDate()).padStart(2, '0'))
    .replace(/\%J/, date.getDate())
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
    raise("Date invalide : $1 : $2", [dateStr, err.message])
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
      msg = msg.replace(/[^\\]\n/g, '<br>').replace(/\\\n/g, "\n")
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