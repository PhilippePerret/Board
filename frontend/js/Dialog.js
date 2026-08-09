/**
 * La classe dont héritent tous les panneaux
 * 
 * Passer la données `idValues` pour faire savoir à Dialog quelles valeurs
 * doivent être retournées. Ça doit être obligatoirement l'id DOM d'un
 * élément qui répond à `value', comme un select par exemple.
 * 
 * Si onShow est défini, c'est une fonction qui est appelée après l'ouverture
 * du panneau.
 * 
 * title
 *    Le titre que doit avoir le dialog
 * 
 * width
 *    La largeur avec unité. Par exemple '680px'
 * 
 * mode
 *    'float' ou 'modal' pour définir le comportement de la 
 *    fenêtre suivant qu'elle doit flotter sur le reste ou 
 *    bloquer les opération (modal)
 * 
 * ouiBtn
 *    Définition du bouton OK. :name, :onclick
 *    :if peut définir une condition qui doit être rempli pour que le
 *    bouton soit actif. La valeur est une fonction qui doit retour-
 *    ner true (bouton actif) ou false (bouton inactif)
 * 
 * ouiBtnIf
 *    La fonction de condition peut être aussi transmise sous forme
 *    de propriété.
 *    Cette fonction reçoit le dialog (this) en premier argumetn. par
 *    exemple, pour obtenir les values d'un sélect, il suffit de 
 *    faire dialog.values
 * 
 * nonBtn
 *    Définition du bouton Cancel. :name, :onclick
 *    :if comme le bouton ouiBtn
 *    nonBtn: ':none:' pour ne pas affiche de bouton non du tout
 * 
 * nonBtnIf
 *    Condition sur le bouton "Non" en propriété
 *    Reçoit le Dialog en argument
 * 
 * Si midBtn définit keep: true, la fenêtre courante est gardée.
 * 
 * midBtnIf
 *    Cf. ouiBtnIf, pour le bouton du millieu.
 * 
 */
class Dialog {
  static panelIndex = 0

  constructor(data){
    this.data = data
    this.returnedIdValues = data.idValues ?? null // Pour savoir quelles valeurs retourner avec oui
    this.id    = data.id ?? `panel-${++Dialog.panelIndex}`
    this.width = data.width ?? data.w ?? '520px'
    this.title = data.title ?? '- panneau sans titre (title) -'
    this.message = data.message ?? data.q ?? null
    this.errorMessage = data.errorMessage // en cas d'erreur
    this.content      = data.content ?? null
    this.default      = data.default
    this.defaultValue = data.defaultValue
    this.ouiData      = data.ouiBtn ?? {name: getMsg('btn-yes'), onclick: () => message("[SYSTEM] Bouton oui à définir")}
    this.midData      = data.midBtn ?? null
    if (data.nonBtn == ':none:') {
      this.nonData = null
    } else {
      this.nonData      = data.nonBtn ?? {name: getMsg('btn-no'), onclick: () => message("[SYSTEM] Bouton non à définir")}
    }
    this.defaultKey   = data.defaultKey ?? 'Oui'
    this.unscrimmed   = data.unscrimmed ?? false // pour ne pas mettre de flou
    this.projet       = data.projet ?? null
    this.ouiBtnIf     = data.ouiBtnIf ?? data.ouiBtn?.if ?? null
    this.nonBtnIf     = data.nonBtnIf ?? data.nonBtn?.if ?? null
    this.midBtnIf     = data.midBtnIf ?? data.midBtn?.if ?? null
    // Une fonction qui peut tranformer la valeur avant de la retourner
    this.toRealValue  = data.toRealValue ?? ((v) => v)
    // Identifiant du champ de valeur (rappel : dans ces Dialog, il n'y a toujours
    // qu'un seul champ d'édition)
    this.FId  = `__${this.id}__`
    this.FDomId = `#${this.FId}`
    // Si aucune valeur de renvoi n'est défini, on met la valeur par défaut
    if (this.returnedIdValues === null){
      this.returnedIdValues = [this.FId]
    }
    
    this.built = false
    this._boundOnKeyDown = this.onKeyDown.bind(this)
  }

  // À surclasser par l'héritière
  afterBuild(){}  // pas encore affiché
  onShow(){}      // affiché

  show(){
    this.build()
    this._setButtons()
    this.obj.classList.remove('hidden')
    this.onShow()
  }
  open(){return this.show()}

  hide(){
    unlisten(window, 'keydown', this._boundOnKeyDown)
    this.obj.remove()
  }
  close(){return this.hide()}


  /**
   * Méthode qui gère l'état des boutons si leur paramètre :if
   * est défini.
   */
  _setButtons(){
    if ( this.ouiBtnIf ) { this._treateStateButton(this.ouiBtnIf, this.btnOui) }
    if ( this.nonBtnIf ) { this._treateStateButton(this.nonBtnIf, this.btnNon) }
    if ( this.midBtnIf ) { this._treateStateButton(this.midBtnIf, this.btnMid) }
  }
  _treateStateButton(condition, bouton){
    bouton.disabled = !condition(this)
  }

  /**
   * === GESTIONNAIRE D'ÉVÈNEMENTS ===
   */

  onOui(ev){
    this.ouiData.keep || this.hide()
    Spinner.start()
    stopEvent(ev)
    if ('function' == typeof this.ouiData.onclick) {
      let returnedValues = [];
      if (this.returnedIdValues) {
        const onlyOne = this.returnedIdValues.length == 1
        this.returnedIdValues.forEach(idValue => {
          const el = DGet(this.FDomId, this.obj)
          if (el) {
            let value = el.value
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
      // ouiData.onclick n'est pas une fonction (pas gênant en soi)
      // console.warn("this.ouiData.onclick n'est pas une fonction", this.ouiData)
    }
    Spinner.stop()
    return false
  }

  onNon(ev){
    ;(this.nonData && this.nonData.keep) || this.hide()
    if ('function' == typeof this.nonData?.onclick) {
      this.nonData.onclick()
    }
    return stopEvent(ev)
  }
  onMid(ev){
    ;(this.midData && this.midData.keep) || this.hide()
    if ('function' == typeof this.midData?.onclick) {
      this.midData.onclick()
    } else {
      console.error("this.midData.onclick", this.midData.onclick)
    }
    return stopEvent(ev)

  }

  static HANDLED_KEYS = {
      Enter:  {nokey: null}
    , Escape: {nokey: 'onNon'}
  }
  onKeyDown(ev) {
    // console.log("-> onKeyDown", ev)
    var dEvent;
    // console.log("ev", ev)
    if ( (dEvent = Dialog.HANDLED_KEYS[ev.key]) ){
      // console.log("[onKeyDown] dEvent = ", dEvent)
      const method = dEvent.nokey ?? `on${this.defaultKey}`
      // console.log("[onKeyDown] method", method)
      this[method]()
      return stopEvent(ev)
    }
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
      const msg = DCreate('DIV', {class: 'message', text: this.message ?? '', style: "max-height:500px;overflow: auto;"})
      // Du contenu HTML dans div.message
      if (this.content) msg.appendChild(this.content)
      if ( this.errorMessage ) {
        const errMsg = DCreate('DIV', {class:'error', text: this.errorMessage})
        msg.appendChild(errMsg)
      }
      div.appendChild(msg)
    }
    // Pied de page
    const footer = DCreate('DIV', {class:'footer'})
    if (this.nonData) {
      this.btnNon = DCreate('BUTTON', {id: `${this.id}-btn-non`, class:'btn-non left-btn', style: `width:${this.nonData.width ?? 'auto'}` , text: this.nonData.title || this.nonData.name})
      footer.appendChild(this.btnNon)
      this.btnNon.disabled = (this.nonData?.enable === false)
    }
    this.btnMid = DCreate('BUTTON', {id: `${this.id}-btn-mid`, class: 'btn-mid, mid-btn' + ' ' + (this.midData?'':'invisible'), style: `width:${this.midData?.width ?? 'auto'}` , text: this.midData?.title || this.midData?.name ||''})
    footer.appendChild(this.btnMid)
    this.btnMid.disabled = (this.midData?.enable === false)
    this.btnOui = DCreate('BUTTON', {id: `${this.id}-btn-oui`, class:'btn-oui right-btn main', style: `width:${this.ouiData.width ?? 'auto'}` , text: this.ouiData.title || this.ouiData.name})
    footer.appendChild(this.btnOui)
    this.btnOui.disabled = (this.ouiData?.enable === false)

    this[`btn${this.defaultKey}`].classList.add('default-btn')

    div.appendChild(footer)
    this.obj = scrim
    document.body.appendChild(scrim)
    this.observe()
    this.built = true
    if ( this.unscrimmed ) unScrim(scrim)

    this.afterBuild()
  }

  observe(){
    listen(this.btnOui, 'click', this.onOui.bind(this))

    if (this.nonData) {
      listen(this.btnNon, 'click', this.onNon.bind(this))
    }
    
    listen(this.btnMid, 'click', this.onMid.bind(this))
    listen(window, 'keydown', this._boundOnKeyDown)
  }
}