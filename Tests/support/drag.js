// Glisser-déposer par coordonnées écran (mouse down / move / up réels via
// CoreGraphics), pour les éléments qui utilisent le drag-and-drop HTML5
// natif (dataTransfer + dragstart/dragover/drop) — un simple AXPress
// (click()) ne déclenche pas cette séquence d'évènements.
//
// Usage : osascript -l JavaScript Tests/support/drag.js <fromDomId> <toDomId>
//     ou : osascript -l JavaScript Tests/support/drag.js <fromDomId> <dx>,<dy>
//         (décalage relatif en pixels depuis fromDomId, ex. "300,0" = 300px
//         vers la droite — pas besoin d'un 2e élément DOM comme cible)

ObjC.import('CoreGraphics')

const appName = 'Board'
const defaultTimeout = 5

// ObjC.import n'expose que les classes/méthodes Objective-C, pas les
// constantes C (enums de CGEventTypes.h) — $.kCGHIDEventTap etc. valent
// undefined, donc CGEventPost ne postait rien, sans lever d'erreur.
// Valeurs numériques littérales à la place (documentées, stables).
const kCGHIDEventTap        = 0
const kCGEventLeftMouseDown = 1
const kCGEventLeftMouseUp   = 2
const kCGEventLeftMouseDragged = 6
const kCGMouseButtonLeft    = 0

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

// "delay" est un global JXA non redéfinissable (cf. version-pers/ax_server.js)
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

// position()/size() : coordonnées écran (pas relatives à la fenêtre), comme
// pour toute UI element de System Events.
function centerOf(elem) {
  const pos = elem.position()
  const size = elem.size()
  return { x: pos[0] + size[0] / 2, y: pos[1] + size[1] / 2 }
}

function parseOffset(str) {
  const m = str.match(/^(-?\d+),(-?\d+)$/)
  return m ? { dx: parseInt(m[1], 10), dy: parseInt(m[2], 10) } : null
}

function postMouseEvent(type, point, button) {
  const event = $.CGEventCreateMouseEvent(null, type, point, button)
  $.CGEventPost(kCGHIDEventTap, event)
}

function run(argv) {
  if (argv.length < 2) {
    throw new Error('Usage: drag.js <fromDomId> <toDomId>')
  }
  // Sans ça, les clics simulés (coordonnées écran) atterrissent sur
  // n'importe quelle fenêtre réellement visible à cet endroit (ex. VSCode),
  // pas forcément Board.
  Application(appName).activate()
  pauseBriefly(0.2)

  const fromEl = waitForElement(argv[0], defaultTimeout)
  const from = centerOf(fromEl)
  const offset = parseOffset(argv[1])
  const to = offset
    ? { x: from.x + offset.dx, y: from.y + offset.dy }
    : centerOf(waitForElement(argv[1], defaultTimeout))

  const steps = 12
  postMouseEvent(kCGEventLeftMouseDown, from, kCGMouseButtonLeft)
  pauseBriefly(0.05)
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const p = { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t }
    postMouseEvent(kCGEventLeftMouseDragged, p, kCGMouseButtonLeft)
    pauseBriefly(0.03)
  }
  // Laisser le temps au dragover d'être traité avant le drop.
  pauseBriefly(0.1)
  postMouseEvent(kCGEventLeftMouseUp, to, kCGMouseButtonLeft)

  return 'ok'
}
