/**
 * Implémentation des outils du panneau "Outils" (déclarés dans
 * ToolsData.js). Premier outil : position + taille de la fenêtre de
 * premier plan d'une application choisie parmi les applications ouvertes,
 * copiées dans le presse-papier (backend/scripts/GetAppWindowBounds.scpt).
 */
class Tools {

  /**
   * @api
   * 
   * Pour obtenir la dimension d'une fenêtre dans l'application 
   * choisie
   * 
   * TODO Utiliser plutôt le Prompter
   */
  static toolGetWindowBounds(retour){
    if (undefined == retour) {
      server.send({action: 'list-running-apps'}, this.toolGetWindowBounds.bind(this))
    } else {
    new SelectDialog({
        title: getMsg('Window-position-and-size')
      , id: 'tools_app_window_bounds'
      , message: getMsg('which-widhow-app')
      , values: retour.data.apps
      , ouiBtn: {name: getMsg('Validate'), onclick: this.onAppChosen.bind(this)}
      , nonBtn: {name: getMsg('Cancel')}
    }).show()

    }
  }

  static toolGitInit(key, value){
    console.log("key/retour", key, value)

    // S'assurer qu'il y a un projet courant
    const project = Project.current || raiseError('folder-required')

    // Valeurs définies
    if (key){
      if (value === null) return // annulation
      value = value.trim()
      switch(key){
        case 'github_account':
          project.set('github_account', value, true)
          break
        case 'github_name':
          project.set('github_name', value, true)
          break
      }
    }
    // S'assurer que l'utilisateur à un compte Github (github_account du projet)
    const github_account = project.get('github_account')
    if (!github_account) {
      return Prompter.prompt({ 
          title: getMsg('github-account')
        , type: 'string'
        , q: getMsg('github-account')
      }, this.toolGitInit.bind(this, 'github_account'))
    }
    // S'assurer que le projet à un Github (github_name du projet)
    const github_name = project.get('github_name')
    if (!github_name) {
      return Prompter.prompt({ 
          title: getMsg('github-project-name')
        , type: 'string'
        , q: getMsg('github-project-name')
      }, this.toolGitInit.bind(this, 'github_name'))
    }
    // Demander s'il faut créer les labels ?
    Prompter.prompt({
        title: "Labels ?"
      , q: "Labels à créer (n'en sélectionner aucun pour ne pas les toucher."
      , type: 'select'
      , multi: true
      , values: GITHUB_LABELS
    }, this.execGitInitialisation.bind(this))
  }

  static execGitInitialisation(retour){
    console.log("-> execGitInitialisation", retour)
    const labels = retour // peut être vide => ne pas le faire
    const project = Project.current || raiseError('folder-required')
    const github_name = project.get('github_name')
    const github_account = project.get('github_account')
    console.log("Je vais procéder à l'initialisation de GIT sur le compte '%s' pour le projet '%s' ", github_account, github_name)
    // Jouer le script GitInit.rb
    server.send({
        action: "git-ope"
      , git_ope: 'init_for_project'
      , git_args: [project.path, github_account, github_name, labels]
      , no_raise: true
    }, this.afterGitInitialisation.bind(this))
    // todo
    // Jouer le script de création des labels 
    // todo

  }
  static afterGitInitialisation(retour){
    console.log("-> afterGitInitialisation fin d'init git", retour)
    if (retour.data.error) {
      erreur(retour.data.error)
    } else {
      message(true, "Git installé avec succès.")
    }
  }


  static onAppChosen(appName){
    server.send({action: 'get-app-window-bounds', appName: appName}, this.onWindowBounds.bind(this))
  }

  static onWindowBounds(retour){
    const data = retour.data
    if (data.ok === false) { message(data.error); return }
    message(getMsg('size-and-position-in-clipboard', [data.x, data.y, data.width, data.height]))
  }

  // Appelé par un bouton outil qui ne définit pas de :run, peut-être
  // parce que c'est un script-service (il est défini comme un 
  // script-service)
  static onClick(dataTool){
    new Tools(dataTool).run()
  }


  constructor(data){
    this.data = data
    this.type = data.type
  }
  run(){
    console.log("Je joue l'outil", this)
    switch(this.type){
      case 'script_service': return this.execAsScriptService()
    }
  }

  execAsScriptService(){
    const service = new ScriptService(null, null)
    service.run({data: this.data.steps}, this.afterExecAsScriptService.bind(this))
  }

  // À la fin de l'outil joué comme script service
  /**
   * Pour le moment, on n'a rien besoin de faire, si le tool est bien
   * défini. Mais on pourrait peut-être plus tard, faire des trucs.
   */
  afterExecAsScriptService(service){
    // console.info("service", service)
  }

}
