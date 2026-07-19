/**
 * La classe dont héritent tous les panneaux
 * 
 * Passer la données `idValues` pour faire savoir à Dialog quelles valeurs
 * doivent être retournées. Ça doit être obligatoirement l'id DOM d'un
 * élément qui répond à `value', comme un select par exemple.
 * 
 * Si onShow est défini, c'est une fonction qui est appelée après l'ouverture
 * du panneau.
 */
class Dialog {
  static panelIndex = 0

  constructor(data){
    this.returnedIdValues = data.idValues ?? null // Pour savoir quelles valeurs retourner avec oui
    this.id    = data.id ?? `panel-${++Dialog.panelIndex}`
    this.width = data.width ?? data.w ?? '520px'
    this.title = data.title ?? '- panneau sans titre (title) -'
    this.message = data.message ?? null
    this.content = data.content ?? null
    this.defaultValue = data.defaultValue ?? null
    this.ouiData = data.ouiBtn ?? {name: 'OUI', onclick: () => message("Bouton oui à définir")}
    this.midData = data.midBtn ?? null
    this.nonData = data.nonBtn ?? {name: 'NON', onclick: () => message("Bouton non à définir")}
    this.defaultKey = data.defaultKey ?? 'Oui'
    this.unscrimmed = data.unscrimmed ?? false // pour ne pas mettre de flou
    // Une fonction qui peut tranformer la valeur avant de la retourner
    this.toRealValue = data.toRealValue ?? ((v) => v)
    // Identifiant du champ de valeur (rappel : dans ces Dialog, il n'y a toujours
    // qu'un seul champ d'édition)
    this.FId  = `__${this.id}__`
    this.FDomId = `#${this.FId}`
    // Si aucune valeur de renvoi n'est défini, on met la valeur par défaut
    if (this.returnedIdValues === null){
      this.returnedIdValues = [this.FId]
    }
    
    this.built = false
  }

  show(){
    this.build()
    listen(window, 'keydown', this.onKeyDown.bind(this))
    this.obj.classList.remove('hidden')
    this.onShow && this.onShow()
  }
  open(){return this.show()}
  
  hide(){
    unlisten(window, 'keydown', this.onKeyDown.bind(this))
    this.obj.remove()
  }
  close(){return this.hide()}

  /**
   * === GESTIONNAIRE D'ÉVÈNEMENTS ===
   */

  onOui(ev){
    if ('function' == typeof this.ouiData.onclick) {
      let returnedValues = [];
      if (this.returnedIdValues) {
        const onlyOne = this.returnedIdValues.length == 1
        this.returnedIdValues.forEach(idValue => {
          const el = DGet(this.FDomId, this.obj)
          if (el) {
            let value = el.value
            if (el.TagName == 'SELECT') { value = el.options[el.selectedIndex].value }
            returnedValues.push(value)
          }
        })
        if (onlyOne && Array.isArray(returnedValues)) returnedValues = returnedValues[0]
        const realValue = this.toRealValue(returnedValues)
        this.ouiData.onclick(realValue)
      } else {
        this.ouiData.onclick()
      }
    } else {
      error('this.ouiData.onclick n’est pas une fonction')
    }
    this.hide()
    return stopEvent(ev)
  }

  onNon(ev){
    this.hide()
    if ('function' == typeof this.nonData.onclick) {
      this.nonData.onclick()
    }
    return stopEvent(ev)
  }
  onMid(ev){
    this.hide()
    if ('function' == typeof this.midData.onclick) {
      this.midData.onclick()
    } else {
      console.error("this.midData.onclick", this.midData.onclick)
      error('this.midData.onclick n’est pas une fonction')
    }
    return stopEvent(ev)

  }

  static HANDLED_KEYS = {
    Enter: {nokey: null},
    Escape: {nokey: 'onNon'}
  }
  onKeyDown(ev) {
    var dev;
    // console.log("ev", ev)
    if ( (dev = Dialog.HANDLED_KEYS[ev.key]) ){
      const method = dev.nokey ?? `on${this.defaultKey}`
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
    if (this.message || this.content) {
      const msg = DCreate('DIV', {class: 'message', text: this.message ?? ''})
      // Du contenu HTML dans div.message
      if (this.content) msg.appendChild(this.content)
      div.appendChild(msg)
    }
    // Pied de page
    const footer = DCreate('DIV', {class:'footer'})
    this.btnNon = DCreate('BUTTON', {id: 'btn-non', class:'btn-non left-btn', style: `width:${this.nonData.width ?? 'auto'}` , text: this.nonData.title || this.nonData.name})
    footer.appendChild(this.btnNon)
    this.btnNon.disabled = (this.nonData?.enable === false)
    this.btnMid = DCreate('BUTTON', {id: 'btn-mid', class: 'btn-mid, mid-btn' + ' ' + (this.midData?'':'invisible'), style: `width:${this.midData?.width ?? 'auto'}` , text: this.midData?.title || this.midData?.name ||''})
    footer.appendChild(this.btnMid)
    this.btnMid.disabled = (this.midData?.enable === false)
    this.btnOui = DCreate('BUTTON', {id: 'btn-oui', class:'btn-oui right-btn main', style: `width:${this.ouiData.width ?? 'auto'}` , text: this.ouiData.title || this.ouiData.name})
    footer.appendChild(this.btnOui)
    this.btnOui.disabled = (this.ouiData?.enable === false)

    this[`btn${this.defaultKey}`].classList.add('default-btn')

    div.appendChild(footer)
    this.obj = scrim
    document.body.appendChild(scrim)
    this.observe()
    this.built = true
    if ( this.unscrimmed ) unScrim(scrim)
  }

  observe(){
    listen(this.btnOui, 'click', this.onOui.bind(this))
    listen(this.btnNon, 'click', this.onNon.bind(this))
    listen(this.btnMid, 'click', this.onMid.bind(this))
    listen(window, 'keydown', this.onKeyDown.bind(this))
  }
}