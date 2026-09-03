/**
 * Résolution de la visibilité/ordre des services par projet (issue #56).
 *
 * Persistance : Project#included_services / Project#excluded_services,
 * deux chaines d'uid espacés ("12 4 6"), cf. ServiceData.js (:uid) et
 * ProjectData.js.
 *
 * Un service jamais classé (ni dans l'une ni dans l'autre liste — cas
 * d'un service ajouté à ServiceData.js après que le projet ait déjà sa
 * liste enregistrée) est affiché par défaut, inséré à la fin du bloc de
 * son groupe (ou en fin de liste si le groupe n'existe pas encore chez
 * ce projet).
 */

function parseServiceUids(str) {
  return (str || '').trim() ? str.trim().split(/\s+/).map(Number) : []
}
function serializeServiceUids(uids) {
  return uids.join(' ')
}

// Liste ordonnée des données de service (sous-ensemble de +servicesDataArray+)
// à afficher pour +projet+ — sert aussi bien à filtrer un seul panneau
// (COMMON_SERVICES_DATA ou CUSTOM_SERVICES_DATA) qu'une combinaison des deux.
function orderedVisibleServiceData(servicesDataArray, projet) {
  if (!projet) return servicesDataArray
  const excludedSet = new Set(parseServiceUids(projet.excluded_services))
  const allUids = new Set(servicesDataArray.map(s => s.uid))
  const explicit = parseServiceUids(projet.included_services).filter(uid => allUids.has(uid) && !excludedSet.has(uid))
  const explicitSet = new Set(explicit)
  const byUid = {}
  servicesDataArray.forEach(s => byUid[s.uid] = s)
  const unlisted = servicesDataArray.filter(s => !excludedSet.has(s.uid) && !explicitSet.has(s.uid))
  const result = explicit.map(uid => byUid[uid])
  unlisted.forEach(s => {
    let insertAt = -1
    for (let i = result.length - 1; i >= 0; i--) {
      if (result[i].group === s.group) { insertAt = i + 1; break }
    }
    insertAt === -1 ? result.push(s) : result.splice(insertAt, 0, s)
  })
  return result
}

// Liste ordonnée (telle que persistée) des données de service exclues pour +projet+.
function excludedServiceDataOrdered(servicesDataArray, projet) {
  if (!projet) return []
  const byUid = {}
  servicesDataArray.forEach(s => byUid[s.uid] = s)
  return parseServiceUids(projet.excluded_services).map(uid => byUid[uid]).filter(Boolean)
}
