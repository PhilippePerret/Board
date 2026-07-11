// Moteur "pers" : même logique de pilotage AX que Tests/support/ax.applescript
// (recherche par AXDOMIdentifier via System Events), mais portée en JXA et gardée
// vivante en tâche de fond pour toute la durée d'une spec, au lieu de relancer un
// process osascript à chaque action.
//
// Protocole : une requête JSON par ligne sur stdin
//   {"action":"click","needle":"btn-add-project","extra":""}
// une réponse JSON par ligne sur stdout
//   {"ok":true,"result":"..."}  ou  {"ok":false,"error":"..."}
// Le process s'arrête proprement quand stdin est fermé (EOF) côté appelant.
//
// Duplique forcément la logique de ax.applescript (find/wait/click/batch/
// order-of) : la lecture bloquante ligne-à-ligne sur stdin, nécessaire pour
// rester en vie entre deux appels, n'est pas faisable proprement en
// AppleScript classique — JXA + bridge Foundation le permet.

ObjC.import('Foundation')

const appName = 'Board'
const defaultTimeout = 5

// "delay" est déjà un global JXA (Standard Additions) non redéfinissable
// (TypeError: property must be configurable) — nom différent obligatoire.
function pauseBriefly(seconds) {
  const until = Date.now() + seconds * 1000
  while (Date.now() < until) { /* busy-wait court, cohérent avec le delay 0.2s d'origine */ }
}

function axChildren(elem) {
  try { return elem.uiElements() } catch (e) { return [] }
}
function axDomId(elem) {
  try { return elem.attributes.byName('AXDOMIdentifier').value() } catch (e) { return null }
}
function axRole(elem) {
  try { return elem.role() } catch (e) { return null }
}
function axValue(elem) {
  try { return elem.value() } catch (e) { return null }
}
function axParent(elem) {
  try { return elem.attributes.byName('AXParent').value() } catch (e) { return null }
}

function collectText(elem) {
  if (axRole(elem) === 'AXStaticText') {
    const v = axValue(elem)
    return v === null || v === undefined ? '' : String(v)
  }
  let txt = ''
  for (const kid of axChildren(elem)) txt += collectText(kid)
  return txt
}

function findByDomId(elem, domId) {
  if (axDomId(elem) === domId) return elem
  for (const kid of axChildren(elem)) {
    const found = findByDomId(kid, domId)
    if (found) return found
  }
  return null
}

function findByDomIdPrefix(elem, prefixStr) {
  const id = axDomId(elem)
  if (id && id.indexOf(prefixStr) === 0) return elem
  for (const kid of axChildren(elem)) {
    const found = findByDomIdPrefix(kid, prefixStr)
    if (found) return found
  }
  return null
}

function collectInOrder(elem, targetIds, out) {
  const id = axDomId(elem)
  if (id && targetIds.indexOf(id) !== -1) out.push(id)
  for (const kid of axChildren(elem)) collectInOrder(kid, targetIds, out)
  return out
}

function rootWindow() {
  return Application('System Events').applicationProcesses.byName(appName).windows[0]
}

function waitForMatch(matcher, needle, timeoutSeconds) {
  const start = Date.now()
  while (true) {
    let found = null
    try {
      const root = rootWindow()
      found = (matcher === 'prefix') ? findByDomIdPrefix(root, needle) : findByDomId(root, needle)
    } catch (e) { /* fenêtre pas encore là, on retente */ }
    if (found) return found
    if ((Date.now() - start) / 1000 > timeoutSeconds) {
      throw new Error(`Timeout : élément introuvable (${matcher}=${needle}) après ${timeoutSeconds}s`)
    }
    pauseBriefly(0.2)
  }
}

function performOne(action, needle, extraArg) {
  if (action === 'click') {
    waitForMatch('exact', needle, defaultTimeout).actions.byName('AXPress').perform()
  } else if (action === 'click-prefix') {
    waitForMatch('prefix', needle, defaultTimeout).actions.byName('AXPress').perform()
  } else if (action === 'set-value') {
    waitForMatch('exact', needle, defaultTimeout).value = extraArg
  } else if (action === 'set-value-prefix') {
    waitForMatch('prefix', needle, defaultTimeout).value = extraArg
  } else {
    throw new Error('Action batch inconnue : ' + action)
  }
}

function dispatch(theAction, needle, extra) {
  switch (theAction) {
    case 'click': performOne('click', needle, ''); return ''
    case 'click-prefix': performOne('click-prefix', needle, ''); return ''
    case 'set-value': performOne('set-value', needle, extra); return ''
    case 'set-value-prefix': performOne('set-value-prefix', needle, extra); return ''

    case 'get-value': return String(waitForMatch('exact', needle, defaultTimeout).value())
    case 'get-value-prefix': return String(waitForMatch('prefix', needle, defaultTimeout).value())

    case 'wait-for': waitForMatch('exact', needle, extra ? Number(extra) : defaultTimeout); return 'ok'
    case 'wait-for-prefix': waitForMatch('prefix', needle, extra ? Number(extra) : defaultTimeout); return 'ok'

    case 'get-text': return collectText(waitForMatch('exact', needle, defaultTimeout))
    case 'get-text-prefix': return collectText(waitForMatch('prefix', needle, defaultTimeout))

    case 'exists': {
      let found = null
      try { found = findByDomId(rootWindow(), needle) } catch (e) {}
      return found ? 'true' : 'false'
    }

    case 'click-parent': {
      const el = waitForMatch('exact', needle, defaultTimeout)
      axParent(el).actions.byName('AXPress').perform()
      return ''
    }
    case 'click-parent-prefix': {
      const el = waitForMatch('prefix', needle, defaultTimeout)
      axParent(el).actions.byName('AXPress').perform()
      return ''
    }

    case 'order-of': {
      const targetIds = needle.split('\t')
      return collectInOrder(rootWindow(), targetIds, []).join('\n')
    }

    default:
      throw new Error('Action inconnue : ' + theAction)
  }
}

function readLine() {
  const stdin = $.NSFileHandle.fileHandleWithStandardInput
  if (!readLine._buffer) readLine._buffer = ''
  while (readLine._buffer.indexOf('\n') === -1) {
    const data = stdin.availableData
    if (data.length === 0) {
      // EOF : plus rien à lire
      if (readLine._buffer.length === 0) return null
      break
    }
    const chunk = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding).js
    readLine._buffer += chunk
  }
  const idx = readLine._buffer.indexOf('\n')
  if (idx === -1) {
    const line = readLine._buffer
    readLine._buffer = ''
    return line
  }
  const line = readLine._buffer.slice(0, idx)
  readLine._buffer = readLine._buffer.slice(idx + 1)
  return line
}

function writeLine(s) {
  const out = $.NSFileHandle.fileHandleWithStandardOutput
  const data = $.NSString.alloc.initWithString(s + '\n').dataUsingEncoding($.NSUTF8StringEncoding)
  out.writeData(data)
}

function run(argv) {
  while (true) {
    const line = readLine()
    if (line === null) break
    if (line === '') continue
    let req
    try {
      req = JSON.parse(line)
    } catch (e) {
      writeLine(JSON.stringify({ ok: false, error: 'JSON invalide reçu : ' + e.message }))
      continue
    }
    try {
      const result = dispatch(req.action, req.needle, req.extra || '')
      writeLine(JSON.stringify({ ok: true, result: result }))
    } catch (e) {
      writeLine(JSON.stringify({ ok: false, error: String(e.message || e) }))
    }
  }
}
