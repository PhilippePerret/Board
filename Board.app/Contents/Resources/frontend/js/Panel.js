/**
 * La classe dont héritent tous les panneaux
 * 
 * Passer la données `idValues` pour faire savoir à Panel quelles valeurs
 * doivent être retournées. Ça doit être obligatoirement l'id DOM d'un
 * élément qui répond à `value', comme un select par exemple.
 * 
 * Si onShow est défini, c'est une fonction qui est appelée après l'ouverture
 * du panneau.
 */
class Panel {
  static panelIndex = 0

  constructor(data){
    this.returnedIdValues = data.idValues ?? null // Pour savoir quelles valeurs retourner avec oui
    this.id    = data.id ?? `panel-${++Panel.panelIndex}`
    this.width = data.width ?? data.w ?? '520px'
    this.title = data.title ?? '- panneau sans titre (title) -'
    this.message = data.message ?? '- Panneau sans messsage (message) -'
    this.content = data.content ?? null
    this.defaultValue = data.defaultValue ?? null
    this.ouiData = data.ouiBtn ?? {name: 'OUI', onclick: () => message("Bouton oui à définir")}
    this.midData = data.midBtn ?? null
    this.nonData = data.nonBtn ?? {name: 'NON', onclick: () => message("Bouton non à définir")}
    this.built = false
  }

  show(){
    this.built || this.build()
    listen(window, 'keydown', this.onKeyDown.bind(this))
    this.obj.classList.remove('hidden')
    this.onShow && this.onShow()
  }
  
  hide(){
    unlisten(window, 'keydown', this.onKeyDown.bind(this))
    this.obj.classList.add('hidden')
  }

  /**
   * === GESTIONNAIRE D'ÉVÈNEMENTS ===
   */

  onOui(ev){
    if ('function' == typeof this.ouiData.onclick) {
      let returnedValues = [];
      if (this.returnedIdValues) {
        this.returnedIdValues.forEach(idValue => {
          console.log("[onOui] idValue = ", idValue)
          const el = DGet('#__' + idValue + '__', this.obj)
          let value = el.value
          if (el.TagName == 'SELECT') { value = el.options[el.selectedIndex].value }
          console.log("[onOui] el = ", el)
          console.log("[onOui] el.value = ", value)
          returnedValues.push(value)
        })
        console.log("[onOui] returnedValues", returnedValues)
        console.log("[onOui] onclick", this.ouiData.onclick)
        this.ouiData.onclick(returnedValues)
      } else {
        this.ouiData.onclick()
      }
    } else {
      console.error("this.ouiData.onclick", this.ouiData.onclick)
      error('this.ouiData.onclick n’est pas une fonction')
    }
    this.hide()
    return stopEvent(ev)
  }

  onNon(ev){
    if ('function' == typeof this.nonData.onclick) {
      this.nonData.onclick()
    }
    this.hide()
    return stopEvent(ev)
  }
  onMid(ev){
    if ('function' == typeof this.midData.onclick) {
      this.midData.onclick()
    } else {
      console.error("this.midData.onclick", this.midData.onclick)
      error('this.midData.onclick n’est pas une fonction')
    }

    this.hide()
    return stopEvent(ev)
  }

  static HANDLED_KEYS = {
    Enter: {nokey: 'onOui'},
    Escape: {nokey: 'onNon'}
  }
  onKeyDown(ev) {
    var dev;
    // console.log("ev", ev)
    if ( (dev = Panel.HANDLED_KEYS[ev.key]) ){
      const method = dev.nokey ;
      this[method]() 
    } else { return stopEvent(ev)}
  }


  /**
   * === CONSTRUCTION ===
   */
  build(){
    const scrim = DCreate('DIV', {class: 'scrim hidden'})
    const div = DCreate('DIV', {class: 'overlay modal panel', id: this.id, style: `width:${this.width};`})
    scrim.appendChild(div)
    const tit = DCreate('DIV', {class: 'title', text: this.title})
    div.appendChild(tit)
    const msg = DCreate('DIV', {class: 'message', text: this.message})
    // Du contenu HTML dans div.message
    div.appendChild(msg)
    if (this.content) msg.appendChild(this.content)
    // Pied de page
    const footer = DCreate('DIV', {class:'footer'})
    this.nonBtn = DCreate('BUTTON', {class:'btn-non left-btn', style: `width:${this.nonData.width ?? 'auto'}` , text: this.nonData.title || this.nonData.name})
    footer.appendChild(this.nonBtn)
    this.midBtn = DCreate('BUTTON', {class: 'btn-mid, mid-btn' + ' ' + (this.midData?'':'invisible'), style: `width:${this.midData?.width ?? 'auto'}` , text: this.midData?.title || this.midData?.name ||''})
    footer.appendChild(this.midBtn)
    this.ouiBtn = DCreate('BUTTON', {class:'btn-oui right-btn main', style: `width:${this.ouiData.width ?? 'auto'}` , text: this.ouiData.title || this.ouiData.name})
    footer.appendChild(this.ouiBtn)

    div.appendChild(footer)
    this.obj = scrim
    document.body.appendChild(scrim)
    this.observe()
    this.built = true
  }

  observe(){
    listen(this.ouiBtn, 'click', this.onOui.bind(this))
    listen(this.nonBtn, 'click', this.onNon.bind(this))
    listen(this.midBtn, 'click', this.onMid.bind(this))
    listen(window, 'keydown', this.onKeyDown.bind(this))
  }
}