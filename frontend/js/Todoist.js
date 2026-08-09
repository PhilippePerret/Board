class Todoist {

  static todayTaskForNotInter(projet, callback){
    if(projet.todoist_id) {
      this.todayTasksFor(projet, callback, 'not-interactif')
    } else {
      callback([])
    }
  }

  static todayTasksFor(projet, callback, mode = 'interractif') {
    if (projet.todoist_id) {
      this._fetchToday(projet, callback)
    } else if (mode != 'interractif') {
      return null
    } else {
      this._resolveAPIKey(projet, () => this._fetchToday(projet, callback))
    }
  }

  /**
   * On s'assure d'abord que la clé API est bien définie
   */
  static _resolveAPIKey(projet, callback, retour) {
    if (retour && retour.data.apikey === '-undefined-') {
      // Il faut demander à l'utilisateur sa clé API
      this._ask_for_api_key(projet, callback)
    } else if (retour && retour.data.apikey) {
      this._resolveId(projet, callback)
    } else {
      server.send({action: "todoist-get-api-key"}, this._resolveAPIKey.bind(this, projet, callback))
    }
  }

  static _ask_for_api_key(projet, callback, apikey) {
    if ( apikey ) {
      // On doit enregistrer la clé API
      server.send({action: 'todoist-save-token', token: apikey}, this._resolveId.bind(this, projet, callback))
    } else {
      const datadialog = {
          title: getMsg('Todois-api-key')
        , q: getMsg('which-todoist-api-key')
        , ouiBtn: {name: getMsg('OK'), onclick: this._ask_for_api_key.bind(this, projet, callback)}
      }
      new TextFieldDialog(datadialog).show()
    }

  }

  /**
   * On s'assure ensuite de connaitre le titre du projet dans
   * Todoist
   * 
   * [1] Sinon, c'est le retour de la définition de la clé API
   */
  static _resolveId(projet, callback, todoist_title) {
    if ( todoist_title && 'string' == typeof todoist_title /* [1] */) {
      console.log("todoist_title = ", todoist_title)
      server.send({action: 'todoist-find-project', 'todoist-title': todoist_title}, (retour) => {
        projet.set('todoist_id', retour.data.id, callback /* => save */)
      })
    } else {
      new TextFieldDialog({
          title: getMsg('todoist-project-title')
        , q: getMsg('msg-ask-for-todoist-project-title', [projet.title])
        , default: projet.title
        , ouiBtn: {name: getMsg('Find'), onclick: this._resolveId.bind(this, projet, callback)}
      }).show()
    }
  }

  static _fetchToday(projet, callback) {
    // console.log("[_fetchToday] callback", callback)
    D.start()
    D.trace(projet, callback)
    server.send({action: 'todoist-today-tasks', todoist_id: projet.todoist_id, no_raise: true}, (retour) => {
      if (retour.data.tasks.length) {
        console.log("tasks", JSON.parse(JSON.stringify(retour.data.tasks)))
      }
      callback(retour.data.tasks || {error: 'empty'})
    })
    // D.outputTrace()
  }

  static update_tasks(projet, done_ids, new_tasks, mod_tasks, callback){
    server.send({action: 'todoist-update-tasks', project_id: projet.todoist_id, no_raise: true, done_ids, new_tasks, mod_tasks}, callback)
  }

  /**
   * Pour ajouter de nouvelles tâches
   */
  static createNewTasks(projet, tasks, callback){
    server.send({action:'todoist-create-tasks', project_id: projet.todoist_id, tasks}, (retour) => callback(retour))
  }
}

/**
 * Gestion des tâches
 *
 * Cette classe a été inaugurée pour pouvoir gérer les notifications de tâches
 * lorsqu'elles sont heurées.
 */
class Task {
  constructor(data){
    this.content      = data.content
    this.due          = data.due // forcément défini (sinon, elle ne serait jamais remontée)
    this.description  = data.description ?? null
  }
}
