/**
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
 *              Si aucun bouton n'est défini, c'est la notification entière
 *              qui réagit au clic et se détruit si on clique dessus.
 * background   Couleur du fond
 * opacity      Opacité

 */

const NOTIFIER_DEFAULT = {
    left:         40
  , top:          screen.height - 40
  , width:        460
  , opacity:      0.95
  , background:   "#F6F6DC"
  , font_color:   '#000000'
  , teinte:       'light'
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


  /**
   * @api
   * 
   * Cf. data ci-dessus
   */
  static notify(data){
    this.data = this._ensure_data(data)
    window.server.send(this.data, this.onClick.bind(this))
  }

  /**
   * Fonction qui reçoit la valeur transmise par un click sur la 
   * notification, sur un bouton ou sur toute la notification.
   * 
   * Note : la méthode est appelée aussi quand la notification 
   * disparait mais +response+ ne définit alors aucun bouton.
   */
  static onClick(response){
    console.info("Notifier::onClick(response=)", response, this.dataButtons)
    const btnValue = response.data?.button
    const btn = btnValue ? this.getButton(btnValue) : null
    var onclick
    if ( btn ) { onclick = btn.onclick }
    onclick = onclick ?? this.data.onclick
    if ( 'function' == typeof onclick ) {
      onclick(btnValue)
    } else {
      console.warn('Désolé, mais aucune méthode à appeler avec "%s", la valeur du bouton cliqué', btnValue)
    }
  }

  // Retourne les données du bouton du valeur +btnValue+
  static getButton(btnValue){
    return this.dataButtons[btnValue]
  }

  // Conformise les données qui doivent être envoyées
  static _ensure_data(data){
    var html, width, height, left, top, coef, teinte

    /* -- Les boutons -- */
    this.dataButtons = {}
    this.aucunBouton = ! (data.buttons && data.buttons.length)
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

    teinte = isDark(data.background || NOTIFIER_DEFAULT.background) ? 'dark' : 'light';

    Object.assign(data, {
        action:   'notify'
      , buttons:  swiftButtons
      , html:     html
      , position: [left, top]
      , size:     [width, height]
      , delay:    data.delay || 60
      , teinte:   teinte
    })

    // console.log("Data envoyé à notify", data)

    return data
  }


  static buildHtml(data){
    var html = []
    html.push(this.styles(data).replace(/\n/g, '').replace(/\s+/g, '').replace(/__/g, ' '))
    // console.log("Ajout des styles:", html[0])
    if ( this.aucunBouton ) {
      data.buttons = [
          {name: getMsg('its-noted'), value: ':remove:'}
        , {name: getMsg('remind-me-later'), value: ':remindme:'}
      ]
    }
    const div = '<div id="notify">'
    html.push(div)
    data.icon && html.push(`<img src="${data.icon}" class="icon" />`)
    data.title && html.push(`<h1>${data.title}</h1>`)
    html.push(`<div id="message">${data.message}</div>`)
    data.buttons && html.push(this.buildDivButtons(data))
    html.push('</div>')
    const bounds = Measure.boundsOf(html.join(''))
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
      return `<button class="${this.teinte(data)}" onclick="send('${b.value}')">${b.name}</button>`
    }).join('')
    return `<div class="buttons">${buttons}</div>`
  }

  // @return onDark ou onLight en fonction de la tonalité générale
  static teinte(data){
    data.teinte == 'light' ? 'onLight' : 'onDark'
  }

  // Retourne les styles
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
      font-weight: normal; 
      font-family: 'Arial Black';
      font-size:1.1rem;
      margin-left: 4rem;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    button {
      all: unset;
      display: inline-block;
      font-size: 13pt;
      margin-left: 1em;
      opacity: 0.85;
      padding: 2px__12px;
      text-align: center;
      border: 1px__solid;
      border-radius: 4px;
    }
    button.onDark {
      /* volontairement sombre sur sombre */
      color: #000000;
      background-color: #777777;
    }
    button.onLight {
      /* volontairement clair sur clair */
      color: #a9a9a9;
      background-color: #c9c9c9;
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
