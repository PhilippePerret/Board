/**
 * Panneau de réglage des services affichés pour un projet (issue #56).
 *
 * Deux colonnes :
 *   - gauche  : services retirés pour ce projet, classés par groupe
 *   - droite  : services affichés, dans les deux blocs tels qu'affichés
 *               dans l'appli (communs au-dessus, personnalisés en dessous)
 *
 * Drag-and-drop calqué sur Service.js#observeServiceCard : le nœud DOM
 * bougé EN DIRECT au survol (dragover), rien au 'drop' — seul dragend sert
 * à trancher les cas qui ne peuvent pas se décider en direct (transfert
 * d'un groupe entier vers l'autre colonne).
 *
 * Un service ne change jamais de groupe (dataset.group fixe) : il ne
 * réordonne qu'à l'intérieur du groupe de même nom, quelle que soit la
 * colonne. Un groupe (poignée = LEGEND) se réordonne dans SA colonne comme
 * un service dans son groupe ; déposé dans L'AUTRE colonne, il transfère
 * tout ce qu'il contient encore vers le groupe de même nom là-bas (créé si
 * besoin) — le groupe d'origine reste en place, vide.
 *
 * "Réinitialiser" (bouton du milieu) remet l'aperçu à l'état par défaut
 * (rien d'exclu, ordre de déclaration) — la dialog reste ouverte.
 *
 * "Appliquer" relit l'ordre effectif dans le DOM et enregistre
 * included_services / excluded_services en mémoire (pas de save() ici, cf.
 * Project#editData) ; "Renoncer" ferme sans rien faire.
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
    this.leftFieldsets  = {} // groupName -> FIELDSET (créés à la volée)
    this.rightFieldsets = {} // groupName -> FIELDSET (tous pré-créés)
    this.dragged  = null     // {type: 'service'|'group', el}
    this.dropSide = null     // dernière colonne survolée pendant le drag en cours
    this.content  = this.buildUI()
    this.ouiData  = {name: getMsg('Apply'), onclick: this.onApply.bind(this)}
    this.midData  = {name: getMsg('reset-services-visibility-btn'), keep: true, onclick: this.resetToDefault.bind(this)}
    this.nonData  = {name: getMsg('give-up')}
  }

  buildUI(){
    const wrapper = DCreate('DIV', {class: 'service-visibility-wrapper'})

    const leftWrap = DCreate('DIV', {class: 'service-visibility-col-wrap'})
    leftWrap.appendChild(DCreate('DIV', {class:'service-visibility-col-title', text: getMsg('services-visibility-excluded')}))
    this.leftColumn = DCreate('DIV', {class: 'service-visibility-column service-visibility-left'})
    leftWrap.appendChild(this.leftColumn)
    wrapper.appendChild(leftWrap)

    const rightWrap = DCreate('DIV', {class: 'service-visibility-col-wrap'})
    rightWrap.appendChild(DCreate('DIV', {class:'service-visibility-col-title', text: getMsg('services-visibility-included')}))
    this.rightColumn = DCreate('DIV', {class: 'service-visibility-column service-visibility-right'})
    this.rightCommonBlock = this.buildRightBlockContainer(getMsg('Common-services'))
    this.rightCustomBlock = this.buildRightBlockContainer(getMsg('Custom-services'))
    rightWrap.appendChild(this.rightColumn)
    wrapper.appendChild(rightWrap)

    this.observeColumn(this.leftColumn, 'left')
    this.observeColumn(this.rightCommonBlock, 'right')
    this.observeColumn(this.rightCustomBlock, 'right')

    this.fillAll()

    return wrapper
  }

  // Boîte visuellement séparée (titre + cadre) pour un des deux types de
  // service côté droit — jamais mélangés (cf. groupes/services jamais
  // transférables hors de leur bloc d'origine, cf. plus bas).
  buildRightBlockContainer(label){
    const box = DCreate('DIV', {class: 'service-visibility-type-box'})
    box.appendChild(DCreate('DIV', {class: 'service-visibility-type-title', text: label}))
    const block = DCreate('DIV', {class: 'service-visibility-block'})
    box.appendChild(block)
    this.rightColumn.appendChild(box)
    return block
  }

  // +source+ : objet {included_services, excluded_services} à résoudre —
  // this.projet par défaut, ou un objet vierge pour un aperçu (resetToDefault)
  // qui ne doit toucher ni this.projet ni les panneaux réels.
  fillAll(source = this.projet){
    this.fillRightBlock(this.rightCommonBlock, COMMON_SERVICES_DATA, source)
    this.fillRightBlock(this.rightCustomBlock, CUSTOM_SERVICES_DATA, source)
    this.fillLeftColumn(source)
  }

  // -- Construction / reconstruction --------------------------------------

  uniqueGroupsOf(servicesDataArray){
    const seen = new Set()
    const groups = []
    servicesDataArray.forEach(s => { if (!seen.has(s.group)) { seen.add(s.group); groups.push(s.group) } })
    return groups
  }

  fillRightBlock(block, servicesDataArray, source = this.projet){
    const visible = orderedVisibleServiceData(servicesDataArray, source)
    // Pré-créer TOUS les groupes de ce bloc (même vides, restent en place).
    this.uniqueGroupsOf(servicesDataArray).forEach(group => {
      this.rightFieldsets[group] = this.createFieldset(block, group)
    })
    visible.forEach(dataService => {
      const fieldset = this.rightFieldsets[dataService.group]
      fieldset.appendChild(this.buildChip(dataService))
    })
  }

  fillLeftColumn(source = this.projet){
    excludedServiceDataOrdered(ALL_SERVICES_DATA, source).forEach(dataService => {
      const fieldset = this.leftFieldsets[dataService.group] || (this.leftFieldsets[dataService.group] = this.createFieldset(this.leftColumn, dataService.group))
      fieldset.appendChild(this.buildChip(dataService))
    })
  }

  // Remet seulement l'APERÇU de cette dialog à l'état par défaut (tout à
  // droite, ordre de déclaration) — ne touche ni this.projet ni les
  // panneaux réels : c'est "Appliquer" (ou "Renoncer") qui tranche, comme
  // pour n'importe quel autre réarrangement fait dans cette dialog.
  resetToDefault(){
    this.leftColumn.innerHTML = ''
    this.rightCommonBlock.innerHTML = ''
    this.rightCustomBlock.innerHTML = ''
    this.leftFieldsets  = {}
    this.rightFieldsets = {}
    this.fillAll({included_services: '', excluded_services: ''})
  }

  createFieldset(column, group){
    const fieldset = DCreate('FIELDSET', {class: 'services-group'})
    const legend = DCreate('LEGEND', {text: group})
    legend.draggable = true
    listen(legend, 'dragstart', ev => {
      ev.stopPropagation()
      this.dragged = {type: 'group', el: fieldset, group: group}
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
    listen(legend, 'dragend', () => this.onGroupDragEnd(fieldset, group))
    fieldset.appendChild(legend)
    column.appendChild(fieldset)
    return fieldset
  }

  // Décide, une fois le drag terminé, si le groupe traîné doit transférer
  // ce qu'il contient encore vers l'autre colonne (jamais déplacé lui-même
  // — seul son contenu bouge, cf. en-tête du fichier).
  onGroupDragEnd(fieldset, group){
    fieldset.classList.remove('service-drag-ghost')
    if (this.dragged?.type === 'group' && this.dragged.el === fieldset && this.dropSide) {
      const originSide = fieldset.parentNode === this.leftColumn ? 'left' : 'right'
      if (this.dropSide !== originSide) {
        const targetFieldset = this.dropSide === 'left'
          ? (this.leftFieldsets[group] || (this.leftFieldsets[group] = this.createFieldset(this.leftColumn, group)))
          : this.rightFieldsets[group]
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
  observeColumn(container, side){
    listen(container, 'dragover', ev => {
      const dragged = this.dragged
      if (!dragged) return
      ev.preventDefault()
      this.dropSide = side
      if (dragged.type !== 'service') return
      const group = dragged.el.dataset.group
      const targetFieldset = side === 'left'
        ? (this.leftFieldsets[group] || (this.leftFieldsets[group] = this.createFieldset(this.leftColumn, group)))
        : this.rightFieldsets[group]
      if (targetFieldset && dragged.el.parentNode !== targetFieldset) {
        targetFieldset.appendChild(dragged.el)
      }
    })
  }

  // -- Application --------------------------------------------------------

  onApply(){
    const includedUids = [
        ...this.readFieldsetUids(this.rightCommonBlock)
      , ...this.readFieldsetUids(this.rightCustomBlock)
    ]
    const excludedUids = this.readFieldsetUids(this.leftColumn)
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
