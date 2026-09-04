/**
 * Panneau de réglage des services affichés pour un projet (issue #56).
 *
 * Un seul type de service affiché à la fois (communs OU personnalisés),
 * calqué sur les panneaux de service de l'appli (ServicePanel.js /
 * SidePanel.js#toggleOpposites) : un bouton au-dessus de la double liste
 * bascule vers l'autre type, avec pour libellé le nom de CET AUTRE type.
 *
 * Pour le type affiché, deux colonnes :
 *   - gauche  : services retirés pour ce projet, classés par groupe
 *   - droite  : services affichés, classés par groupe
 *
 * Les deux types sont construits une fois pour toutes (this.views.common /
 * this.views.custom) et ne sont plus jamais détruits — seule leur visibilité
 * (classe .hidden) change à la bascule : les réarrangements faits sur le
 * type quitté restent donc en mémoire tels quels tant que la dialog reste
 * ouverte, et "Appliquer" les prend en compte tous les deux, qu'ils soient
 * affichés ou non au moment du clic.
 *
 * Drag-and-drop calqué sur Service.js#observeServiceCard : le nœud DOM
 * bougé EN DIRECT au survol (dragover), rien au 'drop' — seul dragend sert
 * à trancher les cas qui ne peuvent pas se décider en direct (transfert
 * d'un groupe entier vers l'autre colonne).
 *
 * Un service ne change jamais de type ni de groupe (dataset.group fixe) :
 * il ne réordonne qu'à l'intérieur du groupe de même nom, quelle que soit
 * la colonne. Un groupe (poignée = LEGEND) se réordonne dans SA colonne
 * comme un service dans son groupe ; déposé dans L'AUTRE colonne (même
 * type), il transfère tout ce qu'il contient encore vers le groupe de même
 * nom là-bas (créé si besoin) — le groupe d'origine reste en place, vide.
 *
 * "Tout réinitialiser" (bouton du milieu) remet l'aperçu des DEUX types à
 * l'état par défaut (rien d'exclu, ordre de déclaration) — la dialog reste
 * ouverte.
 *
 * "Appliquer" relit l'ordre effectif dans le DOM (des deux types) et
 * enregistre included_services / excluded_services en mémoire (pas de
 * save() ici, cf. Project#editData) ; "Renoncer" ferme sans rien faire.
 */
class ServiceVisibilityPanel extends Dialog {
  constructor(projet){
    super({
        id:     `service-visibility-${projet.id}`
      , title:  getMsg('services-visibility-title', [projet.title])
      , width:  '1100px'
      , height: 'max'
    })
    this.projet = projet
    this.currentType = 'common'
    this.views    = {} // 'common'|'custom' -> {root, leftColumn, rightColumn, leftFieldsets, rightFieldsets}
    this.dragged  = null // {type: 'service'|'group', el, view}
    this.dropSide = null // dernière colonne survolée pendant le drag en cours
    this.content  = this.buildUI()
    this.ouiData  = {name: getMsg('Apply'), onclick: this.onApply.bind(this)}
    this.midData  = {name: getMsg('reset-services-visibility-btn'), keep: true, onclick: this.resetAllToDefault.bind(this)}
    this.nonData  = {name: getMsg('give-up')}
  }

  get typeInfo(){
    return {
        common: {label: getMsg('Common-services'), data: COMMON_SERVICES_DATA}
      , custom: {label: getMsg('Custom-services'), data: CUSTOM_SERVICES_DATA}
    }
  }
  get oppositeType(){ return this.currentType === 'common' ? 'custom' : 'common' }

  buildUI(){
    const container = DCreate('DIV', {class: 'service-visibility-container'})

    this.toggleBtn = DCreate('BUTTON', {class: 'service-visibility-toggle-btn'})
    listen(this.toggleBtn, 'click', this.toggleType.bind(this))
    container.appendChild(this.toggleBtn)

    Object.keys(this.typeInfo).forEach(type => {
      const view = this.buildTypeView(type)
      this.views[type] = view
      container.appendChild(view.root)
      this.fillType(type)
    })

    this.showType(this.currentType)

    return container
  }

  buildTypeView(type){
    const root = DCreate('DIV', {class: 'service-visibility-wrapper'})

    const leftWrap = DCreate('DIV', {class: 'service-visibility-col-wrap'})
    leftWrap.appendChild(DCreate('DIV', {class:'service-visibility-col-title', text: getMsg('services-visibility-excluded')}))
    const leftColumn = DCreate('DIV', {class: 'service-visibility-column service-visibility-left'})
    leftWrap.appendChild(leftColumn)
    root.appendChild(leftWrap)

    const rightWrap = DCreate('DIV', {class: 'service-visibility-col-wrap'})
    rightWrap.appendChild(DCreate('DIV', {class:'service-visibility-col-title', text: getMsg('services-visibility-included')}))
    const rightColumn = DCreate('DIV', {class: 'service-visibility-column service-visibility-right'})
    rightWrap.appendChild(rightColumn)
    root.appendChild(rightWrap)

    const view = {root, leftColumn, rightColumn, leftFieldsets: {}, rightFieldsets: {}}
    this.observeColumn(view, leftColumn, 'left')
    this.observeColumn(view, rightColumn, 'right')
    return view
  }

  // Bascule d'affichage entre les deux types déjà construits — rien n'est
  // recréé ni relu, cf. en-tête du fichier.
  showType(type){
    this.currentType = type
    Object.keys(this.views).forEach(t => {
      this.views[t].root.classList[t === type ? 'remove' : 'add']('hidden')
    })
    this.toggleBtn.textContent = this.typeInfo[this.oppositeType].label
  }
  toggleType(){ this.showType(this.oppositeType) }

  // -- Construction / reconstruction --------------------------------------

  uniqueGroupsOf(servicesDataArray){
    const seen = new Set()
    const groups = []
    servicesDataArray.forEach(s => { if (!seen.has(s.group)) { seen.add(s.group); groups.push(s.group) } })
    return groups
  }

  // +source+ : objet {included_services, excluded_services} à résoudre —
  // this.projet par défaut, ou un objet vierge pour un aperçu (resetAllToDefault)
  // qui ne doit toucher ni this.projet ni les panneaux réels.
  fillType(type, source = this.projet){
    const view = this.views[type]
    const servicesDataArray = this.typeInfo[type].data
    const visible = orderedVisibleServiceData(servicesDataArray, source)
    // Pré-créer TOUS les groupes de ce type (même vides, restent en place).
    this.uniqueGroupsOf(servicesDataArray).forEach(group => {
      view.rightFieldsets[group] = this.createFieldset(view, view.rightColumn, group)
    })
    visible.forEach(dataService => {
      const fieldset = view.rightFieldsets[dataService.group]
      fieldset.appendChild(this.buildChip(dataService))
    })
    excludedServiceDataOrdered(servicesDataArray, source).forEach(dataService => {
      const fieldset = view.leftFieldsets[dataService.group] || (view.leftFieldsets[dataService.group] = this.createFieldset(view, view.leftColumn, dataService.group))
      fieldset.appendChild(this.buildChip(dataService))
    })
  }

  // Remet l'APERÇU des DEUX types à l'état par défaut — ne touche ni
  // this.projet ni les panneaux réels : c'est "Appliquer" (ou "Renoncer")
  // qui tranche, comme pour n'importe quel autre réarrangement fait dans
  // cette dialog.
  resetAllToDefault(){
    Object.keys(this.views).forEach(type => {
      const view = this.views[type]
      view.leftColumn.innerHTML  = ''
      view.rightColumn.innerHTML = ''
      view.leftFieldsets  = {}
      view.rightFieldsets = {}
      this.fillType(type, {included_services: '', excluded_services: ''})
    })
  }

  createFieldset(view, column, group){
    const fieldset = DCreate('FIELDSET', {class: 'services-group'})
    const legend = DCreate('LEGEND', {text: group})
    legend.draggable = true
    listen(legend, 'dragstart', ev => {
      ev.stopPropagation()
      this.dragged = {type: 'group', el: fieldset, group: group, view: view}
      ev.dataTransfer.setData('text/plain', 'group')
      setTimeout(() => fieldset.classList.add('service-drag-ghost'), 0)
    })
    // Réordonnement en direct — comme Service.js#observeServiceCard — mais
    // seulement dans SA colonne d'origine : entre colonnes, le transfert
    // (fusion des services restants) se tranche au dragend, cf. plus bas.
    // Sur le FIELDSET entier (pas la seule LEGEND) : sinon la cible seule
    // pour accrocher le survol est le mince bandeau du titre.
    listen(fieldset, 'dragover', ev => {
      const dragged = this.dragged
      if (!dragged || dragged.type !== 'group' || dragged.el === fieldset) return
      if (dragged.el.parentNode !== column) return
      ev.preventDefault()
      ev.stopPropagation()
      const rect = fieldset.getBoundingClientRect()
      const before = (ev.clientY - rect.top) < rect.height / 2
      column.insertBefore(dragged.el, before ? fieldset : fieldset.nextSibling)
    })
    listen(legend, 'dragend', () => this.onGroupDragEnd(view, fieldset, group))
    fieldset.appendChild(legend)
    column.appendChild(fieldset)
    return fieldset
  }

  // Décide, une fois le drag terminé, si le groupe traîné doit transférer
  // ce qu'il contient encore vers l'autre colonne DU MÊME TYPE (jamais
  // déplacé lui-même — seul son contenu bouge, cf. en-tête du fichier).
  onGroupDragEnd(view, fieldset, group){
    fieldset.classList.remove('service-drag-ghost')
    if (this.dragged?.type === 'group' && this.dragged.el === fieldset && this.dropSide) {
      const originSide = fieldset.parentNode === view.leftColumn ? 'left' : 'right'
      if (this.dropSide !== originSide) {
        const targetFieldset = this.dropSide === 'left'
          ? (view.leftFieldsets[group] || (view.leftFieldsets[group] = this.createFieldset(view, view.leftColumn, group)))
          : view.rightFieldsets[group]
        if (targetFieldset) {
          Array.from(fieldset.querySelectorAll(':scope > .service')).forEach(chip => targetFieldset.appendChild(chip))
        }
      }
    }
    this.dragged  = null
    this.dropSide = null
  }

  buildChip(dataService){
    const chip = DCreate('DIV', {class: 'service'})
    chip.appendChild(DCreate('DIV', {class: 'name', text: dataService.name}))
    chip.dataset.uid = dataService.uid
    chip.dataset.group = dataService.group
    chip.draggable = true
    listen(chip, 'dragstart', ev => {
      ev.stopPropagation()
      this.dragged = {type: 'service', el: chip}
      ev.dataTransfer.setData('text/plain', 'service')
      // Alias de glissé : un vrai clone stylé (fond/texte du bouton), plus
      // transparent — le rendu par défaut de WebKit pour ce panneau ne
      // reprenait pas le fond du bouton (texte blanc ~invisible).
      const alias = chip.cloneNode(true)
      alias.classList.remove('service-drag-ghost')
      Object.assign(alias.style, {position: 'absolute', top: '-999px', left: '-999px', opacity: '0.7', pointerEvents: 'none'})
      document.body.appendChild(alias)
      ev.dataTransfer.setDragImage(alias, 20, 20)
      // Même délai que Service.js#observeServiceCard : WebKit capture l'image
      // de glissé juste après ce handler, pas avant.
      setTimeout(() => { chip.classList.add('service-drag-ghost'); alias.remove() }, 0)
    })
    // Réordonnement en direct — un service ne réagit qu'au survol d'un chip
    // de SON groupe (il n'en change jamais), quelle que soit la colonne :
    // ça suffit à la fois à le réordonner et à le faire changer de colonne.
    listen(chip, 'dragover', ev => {
      const dragged = this.dragged
      if (!dragged || dragged.type !== 'service' || dragged.el === chip) return
      if (dragged.el.dataset.group !== chip.dataset.group) return
      ev.preventDefault()
      const rect = chip.getBoundingClientRect()
      const before = (ev.clientY - rect.top) < rect.height / 2
      chip.parentNode.insertBefore(dragged.el, before ? chip : chip.nextSibling)
    })
    listen(chip, 'dragend', () => { chip.classList.remove('service-drag-ghost'); this.dragged = null; this.dropSide = null })
    return chip
  }

  // Survol du fond d'un groupe (fieldset) ou d'une colonne — au delà des
  // chips/légendes eux-mêmes (déjà gérés en direct ci-dessus) : sert à
  // déplacer un service dans un groupe encore vide côté droit, ou à créer
  // à la volée le groupe côté gauche (services), et à mémoriser la colonne
  // survolée pour trancher le cas des groupes au dragend.
  observeColumn(view, container, side){
    listen(container, 'dragover', ev => {
      const dragged = this.dragged
      if (!dragged) return
      ev.preventDefault()
      this.dropSide = side
      if (dragged.type !== 'service') return
      const group = dragged.el.dataset.group
      const targetFieldset = side === 'left'
        ? (view.leftFieldsets[group] || (view.leftFieldsets[group] = this.createFieldset(view, view.leftColumn, group)))
        : view.rightFieldsets[group]
      if (targetFieldset && dragged.el.parentNode !== targetFieldset) {
        targetFieldset.appendChild(dragged.el)
      }
    })
  }

  // -- Application --------------------------------------------------------

  onApply(){
    const includedUids = [
        ...this.readFieldsetUids(this.views.common.rightColumn)
      , ...this.readFieldsetUids(this.views.custom.rightColumn)
    ]
    const excludedUids = [
        ...this.readFieldsetUids(this.views.common.leftColumn)
      , ...this.readFieldsetUids(this.views.custom.leftColumn)
    ]
    // Pas de save() ici : seulement une modification en mémoire (+ aperçu
    // live sur les panneaux réels) — la persistance effective est le job
    // du "Save" de la dialog d'édition du projet (cf. Project#editData,
    // qui sait aussi restaurer ces deux propriétés si "Annuler" est cliqué).
    this.projet.included_services = serializeServiceUids(includedUids)
    this.projet.excluded_services = serializeServiceUids(excludedUids)
    ServicePanel.commonPanel?.refresh()
    ServicePanel.customPanel?.refresh()
  }

  readFieldsetUids(container){
    return Array.from(container.querySelectorAll('.services-group .service'))
      .map(chip => Number(chip.dataset.uid))
  }
}
