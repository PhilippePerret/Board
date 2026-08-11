class ServiceExecuter {

  constructor(service, callback){
    this.service  = service
    this.id       = service.id
    this.name     = service.name
    this.front    = service.front ?? null
    this.params   = service.params
    // console.log("Params dans l'exécuteur du service", service, this.params)
    this.script   = service.script
    this.callback = callback ?? null
    this.repeat   = service.data.repeat ?? false
    this.afterRunWithSuccess = service.data.afterRunWithSuccess ?? null
  }
  
  // Exécution du service
  exec(projet, callback){ D.on && D.trace([projet, callback], 'ServiceExecuter.')
    this.projet = projet
    if (typeof callback == 'function') this.callback = callback
    this._execCount = (this._execCount || 0) + 1
    this._rerun = () => this.exec(projet, callback)
    this.runWithDynParams(this.params)
  }

  /**
   * Exécution d'un service commun
   *
   * La principale différence réside dans le fait que pour un service personnalisé,
   * les paramètres se trouvent dans son .params propre. Alors que dans le service
   * commun, c'est dans le projet.common_services_data que ça se trouve.
   */
  execOnProject(projet){  D.on && D.trace(projet, 'ServiceExecuter.')
    this.projet = projet
    this._rerun = () => this.execOnProject(projet)
    this.runWithDynParams(projet.common_services_data[this.id])
  }

  runWithDynParams(baseParams){
    const SDATA = (ALL_SERVICES_DATA).filter(d => d.id == this.id)[0]
    const dynParams = SDATA.dynParams || []
    const dictParamsValues = this.persistedDictParamsValues(SDATA, baseParams)
    if (dynParams.length > 0) {
      new ParamsDefiner(dynParams, (definers, dictParamsValues) => this.onDynParamsDefined(baseParams, definers, dictParamsValues), this.projet, dictParamsValues).define()
    } else {
      this.dictParamsValues = dictParamsValues
      this.finalyExec(this.applyAfterDefinedParams(baseParams), dictParamsValues)
    }
  }

  onDynParamsDefined(baseParams, definers, dictParamsValues){
    if (!definers) return // définition abandonnée
    // dictParamsValues a déjà été enrichie d'une entrée par dynParam au fil
    // de sa résolution (ParamDefiner#setValue) — rien à y ajouter ici.
    this.dictParamsValues = dictParamsValues
    const arraysValues = definers.map(definer => [definer.value])
    this.finalyExec(this.applyAfterDefinedParams([...baseParams, ...arraysValues]), dictParamsValues)
  }

  // Appelé une seule fois, une fois TOUS les paramètres résolus (persistés
  // + dynamiques) — jamais dans finalyExec, qui peut se réinvoquer lui-même
  // via bypassExec (double application sinon).
  applyAfterDefinedParams(arraysParamsValues){
    return this.service.afterDefinedParams ? this.service.afterDefinedParams(arraysParamsValues) : arraysParamsValues
  }

  // Reconstruit {id: valeur} des params déjà persistés, en zippant l'ordre
  // déclaré (SDATA.params) avec les groupes de valeurs stockés (baseParams).
  // Ne décompose jamais une valeur composite (ex. bounds) : elle est
  // transmise telle quelle sous la clé de son param.
  persistedDictParamsValues(SDATA, baseParams){
    const dictParamsValues = {}
    SDATA.params.filter(p => p.persist !== false).forEach((p, i) => {
      const group = baseParams[i]
      dictParamsValues[p.id] = (Array.isArray(group) && group.length === 1) ? group[0] : group
    })
    return dictParamsValues
  }

  // Point unique de sortie, quel que soit le chemin (custom attaché, commun
  // attaché, commun joué depuis le panneau) : this.front, s'il est défini,
  // est TOUJOURS prioritaire sur l'envoi au backend.
  finalyExec(arraysParamsValues, dictParamsValues){ D.on && D.trace(arraysParamsValues, 'ServiceExecuter.')
    if (this.service.bypassExec && !this.bypassExecIsDone) {
      // Si une fonction est à exécuter avant
      this.bypassExecIsDone = true
      this.service.bypassExec.call(this.service, this.finalyExec.bind(this, arraysParamsValues, dictParamsValues))
      return
    } else if (this.service.beforeExec) {
      // Construit lui-même ce qui doit être envoyé au script, à partir
      // des valeurs résolues indexées par id (persistées + dynamiques).
      const built = this.service.beforeExec.call(this.service, dictParamsValues)
      this.sendToScript(Array.isArray(built) ? built : [built])
    } else {
      this.sendToScript(this.flattenParamsValues(arraysParamsValues))
    }
  }

  sendToScript(params){
    // Tenu jusqu'à afterRunService (ou juste après this.front ci-dessous) —
    // compteur (Spinner.js) : n'éteint pas un sablier déjà tenu par ailleurs
    // (Dialog.onOui), ne s'éteint que quand tous les tenants ont relâché.
    Spinner.start()
    if (this.front) {
      // Pas un script backend, mais un traitement frontend
      // Typiquement : le minuteur ou l'exécution de code javascript
      this.front(this.projet, params)
      Spinner.stop()
      return
    }
    console.log("finalyExec (script '%s') avec les paramètres : ", this.script, params)
    params.forEach((p, i) => {
      try { JSON.stringify(p) } catch (e) {
        console.error(`[DIAG] appel n°${this._execCount} — params[${i}] invalide (${e.message}) :`, p)
      }
    })
    server.send({action: `exec-service`, script: this.script, params: params, no_raise: true}, this.afterRunService.bind(this))
  }

  // -- Appelée après avoir exécuté le service --
  afterRunService(retour){ D.on && D.trace(retour, 'ServiceExecuter.')
    Spinner.stop()
    console.log("RETOUR DU RUN DE SERVICE", retour)
    if (retour.error) {
      if (this.service.onError) {
        this.service.onError(retour.error)
      } else {
        new ErrorsDialog({
            title: getErr('serv-error-on-return')
          , errors: retour.error.split("\n")
        }).show()
      }
      return
    } else {
      // S'il y a une méthode à appeler après le succès du service
      if ( this.afterRunWithSuccess) this.afterRunWithSuccess(this.projet, retour, this.dictParamsValues)
      message(true, (retour.message || '').trimEnd() + getMsg('service-success', [this.name, this.id]))
      // console.log("ServiceExecuter # afterRunService termine normalement.")
      if (this.service.transient /* common service joué depuis panneau */) {
        Service.remove(this.service.uuid)
        historize("- Service supprimé du cache")
      }
      if (this.repeat) {
        // Un service qui se répète en boucle jusqu'à ce que l'user
        // l'abandonne — rejoue via le même point d'entrée que le premier
        // run (exec ou execOnProject) : un service commun (git-commit…)
        // tire ses valeurs de projet.common_services_data, pas de
        // this.params (schéma abstrait, jamais résolu pour ces services-là).
        this._rerun()
      } else {
        typeof this.callback == 'function' && this.callback()
      }
      // D.outputTrace()
    }
  }

  /**
   * Maintenant que les valeurs sont conservées groupées par 
   * paramètres il faut "applatir" la liste avant de l'envoyer.
   * 
   * régression : pour que les anciens projets passent, on doit
   * checker que les éléments sont bien des arrays.
   */
  flattenParamsValues(arraysParamsValues){
    var params = []
    // console.log("arraysParamsValues au départ : ", JSON.parse(JSON.stringify(arraysParamsValues)))
    arraysParamsValues.forEach(paramValues => {
      if (Array.isArray(paramValues)) {
        // console.log("Une liste : ", paramValues)
        params = [...params, ...paramValues]
      } else {
        // console.log("Pas une liste : ", paramValues)
        params.push(paramValues) // ancienne version
      }
    })
    // console.log("params À LA FIN : ", JSON.parse(JSON.stringify(params)))
    return this.escapeParamsIfRequired(params)
  }

  /**
   * Pour tous les services utilisant le script ExecCommand.sh, il faut
   * échapper les espaces pour que les arguments soient bien pris en 
   * compte par la commande.
   */
  escapeParamsIfRequired(params){
    if (this.script != 'ExecCommand.sh') return params
    console.log("params non escapés : ", JSON.stringify(params))
    params = params.map(param => {
      if ('string' == typeof param) {
        param = param.replace(' ', '\ ')
      } 
      return param
    })
    console.log("params escapés : ", params)
    return params
  }



}