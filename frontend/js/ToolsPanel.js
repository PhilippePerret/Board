/**
 * Panneau "Outils" (TOOLS_DATA, cf. frontend/js/ToolsData.js) — ouvert en
 * cliquant sur le lien "Outils" du header (à côté de "Aide", cf. App.js).
 * Chaque ligne déclenche directement son action au clic — pas de valeur à
 * éditer/persister.
 */
class ToolsPanel extends SidePanel {
  get title(){ return 'Outils' }
  get domId(){ return 'tools-panel' }

  buildContent(){
    TOOLS_DATA.forEach(dtool => this.buildRow(dtool))
  }

  // Construction de chaque bouton outil
  buildRow(dtool){
    const row = DCreate('DIV', {class: 'service tools-row', id: `tool-${dtool.id}`})
    const name = DCreate('DIV', {text: dtool.name})
    row.appendChild(name)
    this.listingEl.appendChild(row)
    const bindee = dtool.run ? dtool.run : Tools.onClick.bind(Tools, dtool)
    listen(row, 'click', bindee)
  }
}
