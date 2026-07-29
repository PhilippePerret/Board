/**
 * MODULE MESSAGERIE
 * 
 * Gère tout ce qui relève des messages (dans l'app et notification)
 * 
 * TODO
 *    gestion de l'icône
 * 
 * @usage
 *      Notifier.notify(data)
 * 
 * avec +data+ contient :
 * mode         Type de fenêtre
 *                        modal     : elle bloque tout jusqu'à être fermée
 *              [default] floating  : elle flotte au-dessus
 * message      [requis]  Le message à afficher
 * title        Titre surmontant le message
 * icon         Icône accompagnant le message 
 *              Soit un path d'image existante
 *              Soit un nom 'warning', 'notice', 'error'
 * delay        Délai avant fermeture de la fenêtre
 *              [default] 60 (1 minute)
 * width        Largeur précise de la fenêtre (300 par défaut)
 * height       Hauteur de la fenêtre
 * size         Dimension [width, height] de la fenêtre
 * top          Position top de la fenêtre
 * left         Position left de la fenêtre
 * position     Position [left, top] de la fenêtre
 * buttons      Les boutons à afficher
 *              Liste de {name: "label", value: "lab1", onclick: callback}
 *              Si 'value' n'est pas transmis, c'est :name
 *              Dans ce cas, 
 * background   Couleur du fond
 * opacity      Opacité

 */

const NOTIFIER_DEFAULT = {
    left:         40
  , top:          screen.height - 40
  , width:        460
  , opacity:      0.95
  , background:   "beige"
  , font_color:   'black'
}

/**
 * Pour obtenir la taille d'un bloc quelconque
 * (par exemple pour calculer la taille d'une fenêtr)
 */
class Measure {
  static boundsOf(code){
    if ('string' == typeof code) {
      code = DCreate('DIV', {text: code, style: "padding:1rem;display:inline-block;"})
    } else if (code instanceof HTMLElement) {
      code.style.position = 'fixed'
      code.style.top      = '-1000px'
    } else {
      raise("Impossible de connaitre la dimension de l'argument envoyé (ni string ni HTML Element).")
    }
    document.body.appendChild(code)
    const bounds = code.getBoundingClientRect()
    code.remove()
    return bounds
  }
}

class Notifier {

  // Cf. data ci-dessus
  static notify(data){
    this.data = this._ensure_data(data)
    window.server.send(this.data, this.onClick.bind(this))
  }
  static onClick(response){
    console.log("response", response)
    const btnValue = response.data?.value
    if (btnValue) {
      const btn = this.getButton(btnValue)
      if (btn && 'function' == typeof btn.onclick) btn.onclick()
    }
  }

  // Retourne les données du bouton du valeur +btnValue+
  static getButton(btnValue){
    return this.dataButtons[btnValue]
  }

  // Conformise les données qui doivent être envoyées
  static _ensure_data(data){
    var html, width, height, left, top, coef

    /* -- Les boutons -- */
    this.dataButtons = {}
    var swiftButtons
    if (data.buttons) {
      swiftButtons = data.buttons.map(dbutton => {
        var value = dbutton.value || dbutton.name
        Object.assign(this.dataButtons, {[value]: dbutton})
        return [dbutton.name, value]
      })
    }

    data.icon || Object.assign(data, {icon: 'images/board.svg'})

    ;[left, top]      = data.position || [data.left, data.top] || [NOTIFIER_DEFAULT.left, screen.height - NOTIFIER_DEFAULT.top]
    left  = left  ?? NOTIFIER_DEFAULT.left
    top   = top   ?? NOTIFIER_DEFAULT.top
    ;[html, width, height] = this.buildHtml(data)
    // Interpréter les left et top quand ce sont des pourcentage.
    if (String(left).endsWith('%')) {
      coef = parseInt(left.slice(0, - 1)) / 100 // '50%' → 0.5
      left = screen.width * coef - (width / 2)
    }
    if (left < 0) {left = 40}
    if (String(top).endsWith('%')){
      coef = parseInt(top.slice(0, - 1)) / 100 // '50%' → 0.5
      top = screen.height * (1 - coef) - (height / 2)
    }

    Object.assign(data, {
        action:   'notify'
      , buttons:  swiftButtons
      , html:     html
      , position: [left, top]
      , size:     [width, height]
      , delay:    data.delay || 60
    })

    console.log("Data envoyé à notify", data)

    return data
  }
  static buildHtml(data){
    var html = []
    html.push(this.styles(data).replace(/\n/g, '').replace(/\s+/g, '').replace(/__/g, ' '))
    console.log("Ajout des styles:", html[0])
    html.push('<div id="notify">')
    data.icon && html.push(`<img src="${data.icon}" class="icon" />`)
    data.title && html.push(`<h1>${data.title}</h1>`)
    html.push(`<div id="message">${data.message}</div>`)
    data.buttons && html.push(this.buildDivButtons(data))
    html.push('</div>')
    const bounds = Measure.boundsOf(html.join(''))
    console.log("bounds calculé:", bounds)
    html.push(this.scripts)

    return [html.join('').trim().replace(/\n/g,''), bounds.width, bounds.height]
  }
  // Construction des boutons
  static buildDivButtons(data){
    const buttons = data.buttons.map(b => {
      if (typeof b == 'string') {
        b = {name: b, value: b}
      } else {
        if (!b.value) {b.value = b.name}
      }
      return `<button onclick="send('${b.value}')">${b.name}</button>`
    }).join('')
    return `<div class="buttons">${buttons}</div>`
  }
  static styles(data){
    const width = data.width || data.size?.[0] || NOTIFIER_DEFAULT.width;
    return `<style>
    body__* {
      font-size: 14pt;
      font-family: "Avenir__Next", "Arial__Narrow", Helvetica, Geneva;
    }
    div#notify {
      width: ${width}px;
      position: relative;
      background-color: ${data.background || NOTIFIER_DEFAULT.background};
      text-shadow: 5px__5px__5px__5px__#777;
      border-radius: 1em;
      padding: 1rem;
      opacity: ${data.opacity || NOTIFIER_DEFAULT.opacity};
      z-index: 2000;
    }
    img.icon {
      position: absolute;
      width: 36px;
      top: 24px;
      left: 24px;
    }
    h1 {
      font-style: normal; 
      font-size:1.5rem;
      margin-left: 4rem;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    button {
      font-size: 1em;
    }
    div#message {
      padding:2rem;
      margin-left: 2rem;
      color: ${data.font_color || NOTIFIER_DEFAULT.font_color}
    }
    div.buttons {
    text-align: right;
    padding: 0.5em__1em;
    }
    </style>
    `
  }
  static get scripts(){
    return `
    <script type="text/javascript">
    function send(value){window.webkit.messageHandlers.notifClick.postMessage(value)}
    </script>
    `
  }
}

function getErr(errId, params){
  return textSubstitute(ERRORS[errId], params)
}

function getMsg(msgId, params){
  return textSubstitute(MESSAGES[msgId], params)
}

function message(arg1, arg2, arg3){
  var msg, params;
  const inExergueWindow = (arg1 === true)
  if (inExergueWindow) {
    [msg, params] = [arg2, arg3]
  } else {
    [msg, params] = [arg1, arg2]
  }
  try {
    if( undefined == msg){
      console.info("Aucun message envoyé.")
      return
    } 
    if (msg != "") {
      msg = textSubstitute(msg, params)
    }
    if ( inExergueWindow ) {
      const divMsg = DCreate('DIV', {class:'exergue-message', text: msg})
      var timer = setTimeout(() => {clearTimeout(timer); divMsg.remove()}, 6000)
      document.body.appendChild(divMsg)
    } else {
      divMessage().innerHTML = '<span class="notice">' + msg + '</span>'
      nettoie_message()
    }
    return true
  } catch(err){
    traceError()
    console.error("Erreur avec le message '%s' :", msg, params, err.message)
  }
}

function error(msg, params){
  msg = textSubstitute(msg, params)
  divMessage().innerHTML = '<span class="error">' + msg + '</span>'
  nettoie_message()
  return false
}
function erreur(msg){ return error(msg) }

const nettoie_message = debounce( () => {
  divMessage().innerHTML = ''
}, 10 * 1000)

function divMessage(){
  return this._divmsg || (this._divmsg = DGet('#message'))
}

