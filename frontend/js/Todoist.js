class Todoist {

  static todayTaskForNotInter(projet, callback){
    if(projet.todoist_id) {
      this.todayTasksFor(projet, callback, 'not-interactif')
    } else {
      callback([])
    }
  }

  static todayTasksFor(project, callback, mode = 'interractif') {
    if (project.todoist_id) {
      this._fetchToday(project, callback)
    } else if (mode != 'interractif') {
      return null
    } else {
      this._resolveId(project, () => this._fetchToday(project, callback))
    }
  }

  static _resolveId(project, callback, todoist_title) {
    if ( todoist_title ) {
      console.log("todoist_title = ", todoist_title)
      server.send({action: 'todoist-find-project', 'todoist-title': todoist_title}, (retour) => {
        project.set('todoist_id', retour.data.id, callback /* => save */)
      })
    } else {
      new TextFieldDialog({
          title: getMsg('todoist-project-title')
        , q: getMsg('msg-ask-for-todoist-project-title', [project.title])
        , default: project.title
        , ouiBtn: {name: getMsg('Find'), onclick: this._resolveId.bind(this, project, callback)}
      }).show()
    }
  }

  static _fetchToday(project, callback) {
    // console.log("[_fetchToday] callback", callback)
    D.start()
    D.trace(project, callback)
    server.send({action: 'todoist-today-tasks', todoist_id: project.todoist_id, no_raise: true}, (retour) => {
      if (retour.data.tasks.length) {
        console.log("tasks", JSON.parse(JSON.stringify(retour.data.tasks)))
      }
      callback(retour.data.tasks || {error: 'empty'})
    })
    // D.outputTrace()
  }

  static update_tasks(project, done_ids, new_tasks, mod_tasks, callback){
    server.send({action: 'todoist-update-tasks', project_id: project.todoist_id, no_raise: true, done_ids, new_tasks, mod_tasks}, callback)
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