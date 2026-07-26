class Todoist {

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
    server.send({action: 'todoist-today-tasks', todoist_id: project.todoist_id, no_raise: true}, (retour) => {
      callback(retour.data.tasks || {error: 'empty'})
    })
  }

  static setTasksDone(task_ids, callback){
    server.send({action: 'todoist-set-done', task_ids}, (retour) => callback(retour))
  }

  /**
   * Pour ajouter de nouvelles tâches
   */
  static createNewTasks(projet, tasks, callback){
    server.send({action:'todoist-create-tasks', project_id: projet.todoist_id, tasks}, (retour) => callbakc(retour))
  }
}
