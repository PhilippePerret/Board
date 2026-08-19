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
  /**
   * @api
   *
   * Ouvre le dialog d'évaluation rapide de code (cf. Dialogs.js#EvalCodeDialog).
   */
  static toolEvalCode(){
    new EvalCodeDialog({
        title: getMsg('eval-code-title')
      , id: 'tools_eval_code'
    }).show()
  }

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
    // console.log("key/retour", key, value)

    // S'assurer qu'il y a un projet courant
    const project = Project.current || raiseError('folder-required')

    // Valeurs définies
    if (key){
      if (value === null) return // annulation
      switch(key){
        case 'github_account':
          project.set('github_account', value.trim(), true)
          break
        case 'github_name':
          project.set('github_name', value.trim(), true)
          break
        case 'visibility':
          // Le dépôt distant n'existe pas encore : visibilité choisie,
          // on demande maintenant la description (avant les labels).
          this._gitInitVisibility = value
          return this.toolGitInitAskDescription()
        case 'description':
          this._gitInitDescription = value
          return this.toolGitInitAskLabels()
      }
    }
    // S'assurer que l'utilisateur à un compte Github (github_account du projet)
    const github_account = project.get('github_account')
    if (!github_account) {
      return Prompter.prompt({
          id: 'github-account'
        , title: getMsg('github-account')
        , type: 'string'
        , q: getMsg('github-account')
      }, this.toolGitInit.bind(this, 'github_account'))
    }
    // S'assurer que le projet à un Github (github_name du projet)
    const github_name = project.get('github_name')
    if (!github_name) {
      return Prompter.prompt({
          id: 'github-name'
        , title: getMsg('github-project-name')
        , type: 'string'
        , q: getMsg('github-project-name')
      }, this.toolGitInit.bind(this, 'github_name'))
    }
    // Compte et nom connus : vérifier l'état RÉEL du dépôt distant avant de
    // demander quoi que ce soit d'autre (labels, visibilité). S'il existe
    // déjà mais n'est pas vide, ou qu'on n'a pas les droits de push, on
    // s'arrête ici — jamais de tentative d'init locale dans ce cas.
    Spinner.start(getMsg('github-repo-checking'), () => {
      server.send({
          action: 'git-ope'
        , git_ope: 'check_remote_repo'
        , git_args: [github_account, github_name]
        , no_raise: true
      }, this.onRemoteRepoChecked.bind(this))
    })
  }

  static onRemoteRepoChecked(retour){
    Spinner.stop()
    const data = retour.data
    if (data.error) return erreur(data.error)
    if (data.exists) {
      // Dépôt distant déjà présent, vide, droits ok : pas besoin de
      // visibilité ni de description (le dépôt existe déjà tel quel),
      // direct aux labels.
      this._gitInitVisibility = null
      this._gitInitDescription = null
      return this.toolGitInitAskLabels()
    }
    // Dépôt distant absent : il va être créé, demander sa visibilité —
    // ConfirmDialog à 2 boutons nommés (pas un select, choix binaire).
    new ConfirmDialog({
        title:   getMsg('github-repo-visibility')
      , message: getMsg('github-repo-visibility-q')
      , ouiBtn:  {name: getMsg('Private'), onclick: () => this.toolGitInit('visibility', 'private')}
      , nonBtn:  {name: getMsg('Public'),  onclick: () => this.toolGitInit('visibility', 'public')}
    }).show()
  }

  static toolGitInitAskDescription(){
    Prompter.prompt({
        id: 'github-repo-description'
      , title: getMsg('github-repo-description')
      , q: getMsg('github-repo-description-q')
      , type: 'string'
    }, this.toolGitInit.bind(this, 'description'))
  }

  static toolGitInitAskLabels(){
    Prompter.prompt({
        title: getMsg('Which-labels')
      , q: getMsg('which-labels-to-create')
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
    // console.log("Je vais procéder à l'initialisation de GIT sur le compte '%s' pour le projet '%s' ", github_account, github_name)
    // Jouer le script GitInit.rb
    Spinner.start(getMsg('initing-git-for-project'), () => {
      server.send({
          action: "git-ope"
        , git_ope: 'init_for_project'
        , git_args: [project.path, github_account, github_name, labels, this._gitInitVisibility, this._gitInitDescription]
        , no_raise: true
      }, this.afterGitInitialisation.bind(this))
    })
    // todo
    // Jouer le script de création des labels
    // todo

  }
  static afterGitInitialisation(retour){
    // console.log("-> afterGitInitialisation fin d'init git", retour)
    Spinner.stop()
    if (retour.data.error) {
      erreur(retour.data.error)
    } else {
      message(true, getMsg('git-init-success'))
    }
  }


  static onAppChosen(appName){
    logize('Tools.onAppChosen : envoi get-app-window-bounds', {appName})
    server.send({action: 'get-app-window-bounds', appName: appName, no_raise: true}, this.onWindowBounds.bind(this, appName))
  }

  static onWindowBounds(appName, retour){
    logize('Tools.onWindowBounds : retour reçu', {appName, retour})
    const data = retour.data
    if (data.error) {
      error(data.error)
    } else {
      const dataDial = {
          id: 'window-infos'
        , title: getMsg('Window-position-and-size')
        , q: getMsg('window-position-and-size', appName)
        , default: `
          bounds: {${data.x}, ${data.y}, ${data.x + data.width}, {${data.y + data.height}}
          left: ${data.x}
          top: ${data.y}
          width: ${data.width}
          height: ${data.height}
          `.replace(/\n\s+/g, "\n").trim()
        , dontSelectContent: true
        , ouiBtn: {name: getMsg('OK'), onclick: () => {}}
        , nonBtn: ':none:'
      }
      new TextareaDialog(dataDial).show()
    }
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
