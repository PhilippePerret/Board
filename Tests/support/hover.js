// Survol réel par coordonnées écran (CoreGraphics/CGEvent), pour révéler un
// conteneur masqué par CSS ("display:none") qui n'apparaît qu'au survol
// (frontend/js/Project.js, listener "mouseenter" sur le conteneur des
// services au démarrage : classe "hidden" retirée après 1s). Un élément
// display:none n'a AUCUNE représentation dans l'arbre d'accessibilité tant
// qu'il est masqué — donc pas moyen de le cibler par domId avant de l'avoir
// révélé par un vrai survol souris.
//
// Usage : osascript -l JavaScript Tests/support/hover.js <domId> [secondes]
//   (secondes : durée d'attente après le survol, 1.5 par défaut — laisse le
//   temps au setTimeout(1000) de Project.js de retirer la classe "hidden")

ObjC.import('CoreGraphics')

const appName = 'Board'
const defaultTimeout = 5

function axChildren(elem) {
  try { return elem.uiElements() } catch (e) { return [] }
}
function axDomId(elem) {
  try { return elem.attributes.byName('AXDOMIdentifier').value() } catch (e) { return null }
}
function findByDomId(elem, domId) {
  if (axDomId(elem) === domId) return elem
  for (const kid of axChildren(elem)) {
    const found = findByDomId(kid, domId)
    if (found) return found
  }
  return null
}
function rootWindow() {
  return Application('System Events').applicationProcesses.byName(appName).windows[0]
}

function pauseBriefly(seconds) {
  const until = Date.now() + seconds * 1000
  while (Date.now() < until) { /* busy-wait court */ }
}

function waitForElement(domId, timeoutSeconds) {
  const start = Date.now()
  while (true) {
    let found = null
    try { found = findByDomId(rootWindow(), domId) } catch (e) {}
    if (found) return found
    if ((Date.now() - start) / 1000 > timeoutSeconds) {
      throw new Error(`Timeout : élément introuvable (${domId}) après ${timeoutSeconds}s`)
    }
    pauseBriefly(0.2)
  }
}

function centerOf(elem) {
  const pos = elem.position()
  const size = elem.size()
  return { x: pos[0] + size[0] / 2, y: pos[1] + size[1] / 2 }
}

function postMouseEvent(type, point) {
  const event = $.CGEventCreateMouseEvent(null, type, point, 0)
  $.CGEventPost($.kCGHIDEventTap, event)
}

function run(argv) {
  if (argv.length < 1) {
    throw new Error('Usage: hover.js <domId> [secondes]')
  }
  const seconds = argv.length > 1 ? Number(argv[1]) : 1.5
  const el = waitForElement(argv[0], defaultTimeout)
  const p = centerOf(el)
  postMouseEvent($.kCGEventMouseMoved, p)
  pauseBriefly(seconds)
  return 'ok'
}
