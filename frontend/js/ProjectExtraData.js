const PROJECT_EXTRA_DATA = [
    {id: 'icon', type: 'path-in-project', name: 'Icône du projet', q: 'Choisir une icône SVG ou PNG en la sélectionnant dans le Finder.'}
  , {id: 'background', type: 'color-or-image', name: 'Fond de la carte du projet'}
  , {id: 'genre', type: 'select-or-string', name: 'Genre du projet', values: GENRES_PROJETS}
  /**
   * SI DES VALEURS SONT AJOUTÉES, PENSER À METTRE L'ID DANS LA LISTE DES
   * PROPRIÉTÉS PROJET À ENREGISTRER (PROPERTIES dans Project.js) 
   */
]

class ProjectExtraDataPanel extends SidePanelDefiner {
  get title() { return "Données supplémentaires du projet" }
  get domId() { return 'projet-extradata-panel'}
  get prefixDom() { return 'project-extradata'}
  get PARAMS_DATA() { return PROJECT_EXTRA_DATA }

  currentValue(dParam){
    return this.project.get(dParam.id) ?? dParam.default ?? ''
  }

  // Rebind sur un autre projet — réaffiche les valeurs si le panneau est déjà bâti
  setProject(projet){
    this.project = projet
    if (this.built) this.PARAMS_DATA.forEach(dParam => {
      dParam.currentValue = dParam.valueDomEl.textContent = this.currentValue(dParam)
    })
  }

  updateValue(id, value){
    this.project.set(id, value, true)
    this.apply(id, value)
  }

  // Pour appliquer tout de suite le choix
  apply(id, value) {
    switch(id){
      case 'background':
        this.project.setBackground(undefined, value)
        break
      case 'icon':
        const icon = this.project.buildIcon()
        this.project.obj.insertBefore(icon, this.divTitle)
        break
    }
  }
}
