/**
 * Classe gérant les particularités de Git
 * 
 */
class Git {

  /**
   * @api
   * 
   * Affichage du détail complet d'une issue Git ou de plusieurs 
   * issues.
   * 
   * @param message [String] Contient tout le retour de la commande gh, d'un seul bloc.
   */
  static view(message) {
    const issues = message
      .split("\n")
      .map(issue => JSON.parse(issue.trim()))
      .map(dataIssue => new GitIssue(dataIssue))
    console.info("Issues", issues)

    // Construction des affichages de chaque issue
    const containerIssue = DCreate('DIV')
    issues.forEach( issue => containerIssue.appendChild(issue.build()))

    const dataDial = {
        title: "Liste d'issues Git"
      , width: '900px'
      , content: containerIssue
    }
    new OKDialog(dataDial).show()
  }
}

class GitIssue extends ExtendedObject {

  constructor(data){ 
    super(data)
    console.log("data issue", data)
  }

  /**
   * Construit l'affichage de l'issue
   */
  build(){

    const div = DCreate('DIV', {class:'git-issue'})
    const url  = DCreate('IMG', {class:'issue-goto picto fleft', src:"images/goto.svg"})
    div.appendChild(url)
    const num = DCreate('SPAN', {class:'issue-number', text: String(this.number)})
    const tit = DCreate('DIV', {class:'issue-title', text: escapeHTML(this.title)})
    div.appendChild(tit)
    const desc = DCreate('DIV', {class:'issue-body', text: escapeHTML(this.body).replace(/\n/g,'<br>')})
    div.appendChild(desc)
    // Les infos
    const infos = DCreate('DIV', {class:'issue-infos'})
    div.appendChild(infos)
    const auteur = DCreate('SPAN', {class:'issue-author', text: this.author.name})
    infos.appendChild(auteur)
    const date = DCreate('SPAN', {class: 'issue-date', text: DateUtils.formate(this.createdAt)})
    infos.appendChild(date)

    // Traitement des commentaires s'il y en a
    if (this.comments) {
      // Construction d'un commentaire
      function buildComment(data) {
        const div = DCreate('DIV', {class: 'issue-comment'})
        const body = DCreate('DIV', {class: 'issue-comment-body', text: data.body.replace(/\n/, '<br>')})
        div.appendChild(body)
        return div
      }
      const comments = DCreate('DIV', {class:'issue-comments'})
      div.appendChild(comments)
      var comment
      while (comment = this.comments.shift()){
        comments.appendChild(buildComment(comment))
      }
    }

    // Observation
    listen(url, 'click', this.openUrl.bind(this))
    // On retourne le div qui doit être inscrit
    return div
  }

  openUrl(ev_or_retour){
    if (ev_or_retour.ok){
      // console.log("retour de openUrl", ev_or_retour)
    } else {
      const def = ['open']
      var defBrowser
      if ( (defBrowser = App.getData('default-browser')) ) {
        def.push( `-a "${defBrowser}"`)
      }
      def.push(this.url)
      server.send({action: 'exec-service', script:'ExecCommand.sh', params: [def.join(' ')]}, this.openUrl.bind(this))
      return stopEvent(ev_or_retour)
    }
  }

}