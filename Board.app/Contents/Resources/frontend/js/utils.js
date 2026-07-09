
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
  console.log("-> unScrim")
  setTimeout(function() {
    console.log("scrim", scrim)
    scrim.style = "backdrop-filter: none; background: rgba(0,0,0,0.1);"
    // scrim.style.backdropFilter = 'none!important'
    // scrim.style.background = 'rgba(0, 0, 0, 0.1)!important'
    // scrim.style.backgroundColor = 'red'
    console.log("<- unScrim")
  }, 0)
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

