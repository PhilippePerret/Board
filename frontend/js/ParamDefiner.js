
/**
 * Classe qui permet de définir des paramètres
 * (paramètres tel que définis dans params des Services par exemple)
 *
 * Utilisation
 * ------------
 * on crée une instance ParamsDefiner en lui transmettant en premier
 * argument, une liste des paramètres redéfinir, tel que défini dans
 * les listes de paramètres de l'application, du projet, du service,
 * etc., et en second argument, la fonction callback qui devra être
 * appelée en fin de processus.
 *
 * La fonction +callback+ reçoit en fin de processus la liste des
 * instances ParamDefiner qui correspondent à chaque paramètre. Il
 * suffit de passer en revue cette liste en récupérant l'identifiant
 * (id) et la valeur (value) pour obtenir les valeurs définies.
 *
 * L'obtention de la valeur elle-même (dialogue, lecture projet, appel
 * serveur…), selon le type du paramètre, est entièrement déléguée à
 * Prompter (cf. Prompter.js) : ParamDefiner ne connaît jamais le
 * détail de cette obtention, seulement le résultat.
 */

class ParamsDefiner {
  /**
   * @param params Array des paramètres (p.e. {id: 'mon-id', name: 'Nome' ………})
   * @param callback Function à appeler enfin de processus avec la liste des
   *                  ParamDefiner créer pour chaque paramètre.
   */
  constructor(params, callback, projet = null){
    this.params   = [...params].reverse()
    this.definers = []
    this.callback = callback
    this.projet   = projet
  }
  define(){
    historize('-> ParamsDefiner.define', this)
    const param = this.params.pop()
    if (param) {
      const thedefiner = new ParamDefiner(this, param)
      this.definers.push(thedefiner)
      thedefiner.define()
    } else {
      this.resolve()
    }
  }

  abort(){
    this.callback(null)
    return footerError(getMsg('ope-aborted'))
  }
  resolve(){
    historize('-> ParamsDefiner.resolve', this)
    this.callback(this.definers)
  }
}

/**
 * DÉFINITION D'UN PARAMÈTRES
 */
class ParamDefiner {


  /**
   * @api
   * 
   * Fonctions pour définir les données des services
   * 
   * Inaugurée pour le service 'git-committing' pour obtenir au tout
   * départ la liste des fichiers à commiter
   * 
   * @param data      [Object] Données du paramètre tel que défini dans ServiceData.js
   * @param data.definers   
   *    Instances ParamDefiner. Quand on utilise ces fonctions, en 
   *    général (vraiment ?) c'est pour définir les dynParams. Chacun
   *    dans l'ordre de ServiceData a son propre PDefinir, avec la
   *    propriété :valeur qui contient la valeur dont on peut avoir
   *    besoin pour un paramètres courant.
   *                      
   * @param callback  [Function] 
   *    La méthode _getSelectValuesFromFunction qui doit recevoir les 
   *    valeurs pour poursuivre. C'est-à-dire, pour un select, la 
   *    liste des [value, title], mais ces données select doivent être
   *    mises dans {data: <données options>}
   *    
   * @ATTENTION 
   *    Ce callback attend une table (dict) où la clé :data contient
   *    la valeur attendue. Ne pas l'envoyer brute.
   */

  // Pour +data+ et +callback+, cf. ci-dessus
  static gitGetStatusFiles(data, callback){
    console.log("-> gitGetStatusFiles/data=", data, callback)
    server.send({
        action: 'git-ope'
      , project_path: (data?.projet ?? Project.current).path
      , git_ope: 'get_status_files'
    }, callback)
  }

  /**
   * Obtenir la liste des issues du label donné
   * 
   */
  static issuesListOfTypeForSelect(spec, callback, retour){
    if (retour) {
      // console.log("->issuesListOfTypeForSelect/ data/callback/retour", spec, callback, retour)
      const issuesForSelect = retour.data.map(issue => [issue.number, `#${issue.number} ${issue.title}`])
      callback({data: issuesForSelect})
    } else {
      // Il faut relever les issue
      server.send({
          action:'git-ope'
        , git_ope: 'get_issues'
        , git_args: [spec.definers[0].value]
        , project_path: (spec?.projet ?? Project.current).path
      }, this.issuesListOfTypeForSelect.bind(this, spec, callback))
    }
  }
  /**
   * Obtenir les labels github du projet
   * 
   * Pour +data+ et +callback+, cf. ci-dessus
   */
  static projectIssueLabelsForSelect(data, callback, retour){
    console.log("->projectIssueLabelsForSelect/ data/callback/retour", data, callback, retour)
    const getLabelsProjet = (projet) => {
      server.send({
          action: 'git-ope'
        , project_path: projet.path
        , git_ope: 'get_labels'
      }, this.projectIssueLabelsForSelect.bind(this, data, callback))
    }
    var labels
    const projet = data?.projet ?? Project.current
    if ( retour ) {
      labels = retour.data
      projet.set('github_labels', labels, true)
    } else {
      labels  = projet.get('github_labels')
    }
    
    if (labels) {
      console.log("labels", labels)
      callback({data: labels.split(',').map(label => [label, label])})
    } else {
      return getLabelsProjet(projet)
    }
  }



  constructor(paramLister, param){
    // paramLister contient notamment definers qui contient chaque
    // instance ParamDefinir, avec les valeurs attribuées
    this.paramLister = paramLister
    // console.log("param dans constructeur", param)
    this.param    = param
    // console.log("this.param dans le constructor de ParamDefiner (et paramLister", param, paramLister)
    this.id       = param.id      ?? raise(getErr('id-is-required', param))
    this.name     = param.name    ?? param.id
    this.type     = param.type    ?? raise(getErr('type-is-required', param))
    this.q        = param.q       ?? null
    this.message  = param.message ?? this.q ?? null
    this.default  = param.default ?? null
    this.actual   = param.actual  ?? null // valeur en vigueur, distincte de default
    this.values   = param.values  ?? null
    this.if       = param.if      ?? null
  }

  get currentOrDefault(){ return this.actual ?? this.default }
  get projet(){ return this.paramLister.projet ?? Project.current }

  define() {
    historize('-> ParamDefiner.define', this)
    if ('function' == typeof this.if && this.if(this.paramLister.definers) === false) {
      this.setValue(null)
    } else {
      // cas normal de définition
      Prompter.prompt(this.promptSpec(), this.onPrompted.bind(this))
    }
  }

  // Données transmises à Prompter pour obtenir la valeur de ce paramètre
  promptSpec(){
    let defaultValue = this.currentOrDefault
    if (this.param.useLastAsDefault) {
      // this.paramLister.definers contient déjà ce definer (poussé avant
      // define() par ParamsDefiner#define) : l'avant-dernier est le param précédent
      const previous = this.paramLister.definers[this.paramLister.definers.length - 2]
      if (previous) defaultValue = previous.value
    }
    // this.param : uniquement les champs réellement déclarés pour ce
    // paramètre (values, key_value, key_title, if_undefined…) partent
    // tels quels. Seuls les champs à logique de repli (name, message,
    // default, actual) sont recalculés explicitement.
    return Object.assign({}, this.param, {
        type:     this.type
      , id:       this.id
      , name:     this.name
      , message:  this.message
      , default:  defaultValue
      , actual:   this.actual
      , definers: this.paramLister.definers // Pour disposer partout des choix et valeurs
      , projet:   this.projet
      , ifUndefined: this.param.if_undefined
    })
  }

  onPrompted(value, error){
    if (error) { 
      new ErrorsDialog({
        errors: error.split("\n")
      }).show()
      console.error(error); return 
    }
    this.onNonButton(value)
  }

  setValue(value){
    this.value = value
    this.paramLister.define()
  }
  // Méthode appelée quand on renonce, qu'on fait non, ou par Prompter avec value=null
  onNonButton(value) {
    if ( value === null && this.type !== 'path-or-null' ) {
      this.abort()
    } else {
      this.setValue(value)
    }
  }

  // Pour abandonner les définitions
  abort(){
    this.value = '--aborted--'
    this.paramLister.abort() // interrompra la définition sans rien faire
  }

}
