/**
 * Panneau "Outils" (TOOLS_DATA, cf. frontend/js/ToolsData.js) — ouvert en
 * cliquant sur le lien "Outils" du header (à côté de "Aide", cf. App.js).
 * Contrairement à AppDataPanel/ProjectExtraDataPanel (SidePanelDefiner),
 * chaque ligne déclenche directement son action au clic — pas de valeur à
 * éditer/persister.
 */
class ToolsPanel extends SidePanel {
  get title(){ return 'Outils' }
  get domId(){ return 'tools-panel' }

  buildContent(){
    TOOLS_DATA.forEach(tool => this.buildRow(tool))
  }

  buildRow(tool){
    const row = DCreate('DIV', {class: 'service tools-row', id: `tool-${tool.id}`})
    const name = DCreate('DIV', {text: tool.name})
    row.appendChild(name)
    this.listingEl.appendChild(row)
    listen(row, 'click', tool.run)
  }
}
