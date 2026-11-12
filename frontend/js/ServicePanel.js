class ServicePanel extends SidePanel {
  // Construction des Service (une fois pour toutes) — l'affichage réel
  // (filtré/ordonné par projet, cf. ServiceVisibility.js) est délégué à
  // render(), rejouable à chaque changement de projet courant.
  buildContent(){
    this.SERVICES_DATA
      .map(dataService => new Service(Object.assign(dataService, {stype: this.serviceType})))
      .forEach(service => {
        service.build(this.listing)
        this.observeOrdering(service)
      })
    listen(this.listing, 'dragover', e => { if (this.draggedService || this.draggedGroup) e.preventDefault() })
    listen(this.listing, 'drop', e => {
      if (!this.draggedService && !this.draggedGroup) return
      e.preventDefault()
      this.droppedInPanel = true
    })
    this.render()
  }

  // Classement d'un service dans son groupe, directement dans le panneau,
  // comme dans une fiche de projet (issue #79) — enregistré pour
  // Project.current (included_services) au lâcher dans le panneau.
  observeOrdering(service){
    const card = service.obj
    listen(card, 'dragstart', () => {
      this.draggedService = service
      this.droppedInPanel = false
    })
    listen(card, 'dragover', e => {
      const dragged = this.draggedService
      if (!dragged || dragged === service || dragged.group != service.group) return
      e.preventDefault()
      const rect = card.getBoundingClientRect()
      const before = (e.clientY - rect.top) < rect.height / 2
      card.parentNode.insertBefore(dragged.obj, before ? card : card.nextSibling)
    })
    listen(card, 'dragend', () => {
      if (this.draggedService !== service) return
      this.draggedService = null
      this.droppedInPanel ? this.persistOrder() : this.render()
    })
  }

  // Classement des groupes eux-mêmes (poignée = LEGEND)
  observeGroupOrdering(fieldset, legend){
    legend.draggable = true
    listen(legend, 'dragstart', e => {
      e.stopPropagation()
      e.dataTransfer.setData('text/plain', 'group')
      this.draggedGroup = fieldset
      this.droppedInPanel = false
    })
    listen(fieldset, 'dragover', e => {
      const dragged = this.draggedGroup
      if (!dragged || dragged === fieldset) return
      e.preventDefault()
      const rect = fieldset.getBoundingClientRect()
      const before = (e.clientY - rect.top) < rect.height / 2
      this.listing.insertBefore(dragged, before ? fieldset : fieldset.nextSibling)
    })
    listen(legend, 'dragend', () => {
      if (this.draggedGroup !== fieldset) return
      this.draggedGroup = null
      this.droppedInPanel ? this.persistOrder() : this.render()
    })
  }

  persistOrder(){
    const projet = Project.current
    if (!projet) return this.render()
    const uidsHere  = DGetAll('.services-group > .service', this.listing).map(el => SERVICES_DATA_TABLE[el.id].uid)
    const otherData = this.serviceType == 'common' ? CUSTOM_SERVICES_DATA : COMMON_SERVICES_DATA
    const uidsOther = orderedVisibleServiceData(otherData, projet).map(s => s.uid)
    const included  = this.serviceType == 'common' ? [...uidsHere, ...uidsOther] : [...uidsOther, ...uidsHere]
    projet.included_services = serializeServiceUids(included)
    projet.save()
  }

  // Rejoue l'affichage (déjà construits, cf. buildContent) filtré/ordonné
  // pour Project.current — appelée au build initial et à chaque changement
  // de projet sélectionné (cf. Project.current=).
  render(){
    this.listing.innerHTML = ''
    var currentGroup, currentGroupName
    orderedVisibleServiceData(this.SERVICES_DATA, Project.current).forEach(dataService => {
      const service = Service.get(dataService.id)
      if (service.group != currentGroupName) {
        currentGroup = DCreate('FIELDSET', {class:'services-group'})
        const legend = DCreate('LEGEND', {text: service.group})
        currentGroup.appendChild(legend)
        this.observeGroupOrdering(currentGroup, legend)
        this.listing.appendChild(currentGroup)
        currentGroupName = String(service.group)
      }
      currentGroup.appendChild(service.obj)
    })
  }

  refresh(){ this.built && this.render() }

  get listing(){ return DGet('.services-listing', this.obj) }
}

class CommonPanel extends ServicePanel {
  constructor(){ 
    super()
    ServicePanel.commonPanel = this
    this.opened = true
  }
  get title(){ return getMsg('Common-services')}
  get serviceType(){return 'common'}
  get domId(){ return 'common-services-panel'}
  get SERVICES_DATA(){ return COMMON_SERVICES_DATA}
  get oppositePanel(){ return ServicePanel.customPanel}
  get oppositeButton(){ return getMsg('Custom-services')}
  get closeLabel(){ return null}
}

class CustomPanel extends ServicePanel {
  constructor(){ 
    super()
    ServicePanel.customPanel = this
  }
  get title(){ return getMsg('Custom-services')}
  get serviceType(){return 'custom'}
  get domId(){ return 'custom-services-panel'}
  get SERVICES_DATA(){ return CUSTOM_SERVICES_DATA}
  get oppositePanel(){ return ServicePanel.commonPanel}
  get oppositeButton(){ return getMsg('Common-services')}
  get closeLabel(){ return null}

}