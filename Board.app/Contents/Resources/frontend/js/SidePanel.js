/**
 * Classe abstraite commune aux panneaux ancrés à droite façon "panneau des
 * services" (#common-services-panel/#custom-services-panel, services.css :
 * position fixed, slide via la classe .closed) — mais construits
 * dynamiquement (contrairement à ces deux-là, statiques dans index.html),
 * sur le modèle de Panel.js#build (jamais reconstruits une fois ouverts).
 *
 * Une sous-classe redéfinit `title`, `domId` et `buildContent()`.
 */
class SidePanel {
  static get instance(){ return this._instance || (this._instance = new this()) }
  static toggle(){ this.instance.toggle() }
  static open(){ this.instance.open() }
  static close(){ this.instance.close() }

  constructor(){
    this.built = false
  }

  get title(){ return '- panneau sans titre -' }
  get domId(){ return `panel-${this.constructor.name}` }
  get closeLabel(){ return 'Fermer' }

  // À redéfinir dans les sous-classes, pour remplir this.listingEl
  buildContent(){}

  toggle(){
    this.built || this.build()
    this.obj.classList.contains('closed') ? this.open() : this.close()
  }
  open(){
    this.built || this.build()
    this.obj.classList.remove('closed')
  }
  close(){
    this.built && this.obj.classList.add('closed')
  }

  build(){
    const panel = DCreate('DIV', {class: 'services-panel closed', id: this.domId})
    const fieldset = DCreate('FIELDSET', {class: 'services-listing'})
    fieldset.appendChild(DCreate('LEGEND', {text: this.title}))
    panel.appendChild(fieldset)

    const closeBtn = DCreate('BUTTON', {id: `${this.domId}-close`, class: 'btn-deal-with-services', text: this.closeLabel})
    listen(closeBtn, 'click', this.close.bind(this))
    panel.appendChild(closeBtn)

    document.body.appendChild(panel)

    this.obj = panel
    this.listingEl = fieldset
    this.built = true

    this.buildContent()
  }
}
