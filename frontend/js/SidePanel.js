/**
 * Classe abstraite commune aux panneaux ancrés à droite façon "panneau des
 * services" (#common-services-panel/#custom-services-panel, services.css :
 * position fixed, masqué via la classe générique .hidden — comme tout autre
 * panneau/dialogue de l'appli, plus de jeu sur `right`, incompatible avec le
 * `left` inline posé par Draggable une fois le panneau glissé) — mais
 * construits dynamiquement (contrairement à ces deux-là, statiques dans
 * index.html), sur le modèle de Dialog.js#build (jamais reconstruits une
 * fois ouverts).
 *
 * Une sous-classe redéfinit `title`, `domId` et `buildContent()`.
 */
class SidePanel extends Draggable {
  // static get instance(){ return this._instance || (this._instance = new this()) }
  // static open(){ this.instance.open() }
  // static close(){ this.instance.close() }
  // static toggle(){ this.instance.toggle() }

  constructor(){
    super()
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
    const previous = App.currentPanel
    App.closeCurrentPanel()
    if (previous && previous !== this) {
      this.obj.style.left = previous.obj.style.left
      this.obj.style.top  = previous.obj.style.top
    }
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
    this.obj.classList[this.opened?'remove':'add']('hidden')
  }

  toggleOpposites(){
    this.built || this.build()
    // Le panneau qui prend la place doit apparaître au même endroit que
    // celui qu'il remplace (position posée par Draggable en inline style).
    this.oppositePanel.built || this.oppositePanel.build()
    this.oppositePanel.obj.style.left = this.obj.style.left
    this.oppositePanel.obj.style.top  = this.obj.style.top
    this.close()
    this.oppositePanel.open()
    return this.oppositePanel
  }
  setOppositeButton(){
    if (this.oppositePanel){
      this.toggleBtn.textContent = this.oppositeButton
    }
  }

  build(){
    historize("-> SidePanel#build panneau %s", this.title)
    const panel = DCreate('DIV', {class: 'services-panel hidden', id: this.domId})

    // Poignées de déplacement (gauche/droite, mi-hauteur) — dédiées, pas le
    // panneau entier (cf. Clock.js) : sinon le mousedown intercepté sur tout
    // le panneau (avec preventDefault) empêche le drag HTML5 natif des
    // services listés dedans.
    const handleLeft  = DCreate('DIV', {class: 'services-handle-move services-handle-move-left',  role: 'group'})
    const handleRight = DCreate('DIV', {class: 'services-handle-move services-handle-move-right', role: 'group'})
    panel.appendChild(handleLeft)
    panel.appendChild(handleRight)
    this.listenMove([handleLeft, handleRight], panel)

    const fieldset = DCreate('DIV', {class: 'services-listing'})
    fieldset.appendChild(DCreate('DIV', {class: 'legend', text: this.title}))
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
