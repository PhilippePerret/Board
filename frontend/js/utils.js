
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