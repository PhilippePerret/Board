/**
 * Classe abstraite commune aux panneaux ancrés à droite façon "panneau des
 * services" (#common-services-panel/#custom-services-panel, services.css :
 * position fixed, slide via la classe .closed) — mais construits
 * dynamiquement (contrairement à ces deux-là, statiques dans index.html),
 * sur le modèle de Dialog.js#build (jamais reconstruits une fois ouverts).
 *
 * Une sous-classe redéfinit `title`, `domId` et `buildContent()`.
 */
class SidePanel {
  // static get instance(){ return this._instance || (this._instance = new this()) }
  // static open(){ this.instance.open() }
  // static close(){ this.instance.close() }
  // static toggle(){ this.instance.toggle() }

  constructor(){
    console.log("constructor de %s", this.title)
    this.built  = false
    this.opened = false
  }

  get title(){ return '- panneau sans titre -' }
  get domId(){ return `panel-${this.constructor.name}` }
  get closeLabel(){ return 'Fermer' }

  // À redéfinir dans les sous-classes, pour remplir this.listingEl
  buildContent(){}

  toggle(){
    historize("→ SidePanel#toggle Panneau %s", this.title)
    /*
    new Error().stack
    console.trace()
    //*/
    this.built || this.build()
    console.log("Avant open ou close, this.opened = ", this.opened)
    this[this.opened ? 'close' : 'open']()
    historize("← SidePanel#toggle Panneau %s", this.title)
  }
  open(){
    App.closeCurrentPanel()
    this.setState('opened')
    App.currentPanel = this
    this.setOppositeButton() // Si nécessaire
  }
  close(){
    this.setState('closed')
    if (App.currentPanel === this) App.currentPanel = null
  }
  setState(state){
    this.opened = (state == 'opened')
    this.obj.classList[this.opened?'remove':'add']('closed')
  }

  toggleOpposites(){
    this.built || this.build()
    this.close()
    console.log("this", this)
    console.log("this.oppositePanel", this.oppositePanel)
    this.oppositePanel.open()
    return this.oppositePanel
  }
  setOppositeButton(){
    if (this.oppositeButton){
      this.toggleBtn.textContent = this.oppositeButton
    }
  }

  build(){
    historize("-> SidePanel#build panneau %s", this.title)
    const panel = DCreate('DIV', {class: 'services-panel closed', id: this.domId})
    const fieldset = DCreate('FIELDSET', {class: 'services-listing'})
    fieldset.appendChild(DCreate('LEGEND', {text: this.title}))
    panel.appendChild(fieldset)

    if (this.oppositePanel) {
      const toggleBtn = DCreate('BUTTON', {id: `${this.domId}-toggle`, class: 'btn-deal-with-services', text: this.toggleLabel})
      listen(toggleBtn, 'click', this.toggleOpposites.bind(this))
      panel.appendChild(toggleBtn)
      this.toggleBtn = toggleBtn
    }
    if (this.closeLabel) {
      const closeBtn = DCreate('BUTTON', {id: `${this.domId}-close`, class: 'btn-deal-with-services', text: this.closeLabel})
      listen(closeBtn, 'click', this.close.bind(this))
      panel.appendChild(closeBtn)
    }

    DGet('#panels-container').appendChild(panel)

    this.obj = panel
    this.listingEl = fieldset
    this.buildContent(this.obj)
    
    this.built = true
  }
}
