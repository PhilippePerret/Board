class ConfirmDialog extends Dialog {

  constructor(data){
    super(data)
  }
}

const MAX_LEN_STRING = 90
/**
 * Pour l'affichage des erreurs
 * 
 * On peut transmettre les erreurs avec errors sous plusieurs
 * formats ;
 *  - un string
 *  - une liste de string
 *  - une liste de [error, params]
 *  - un mélange de tout ça
 * 
 * Les textes trop longs (comme les paths) sont découpé pour
 * s'afficher correctement.
 */
class ErrorsDialog extends Dialog {
  constructor(data){
    super(data)
    this.width  = '1400px'
    this.errors = data.errors ?? ''
    console.log("errors au départ", this.errors)
    this.content = this.buildContainerErrors()
    if (data.ouiBtn && 'function' == data.ouiBtn.onclick) {
      this.nonData = {name: 'Finir'}
    } else {
      this.ouiData = {name: 'OK'}
      this.nonData = null // pas de bouton "Non"
    }
  }
  buildContainerErrors() {
    this.normalizeErrors()
    console.log("erreurs après normalisation", this.errors)
    return DCreate('DIV', {
        class: 'error small'
      , text: this.errors.map(error => {
          return `<div class="error">${error}</div>`
        }).join('')
      , style: 'margin:2em 0;padding: 0.5em 1em;'
    })
  }

  /**
   * Cette fonction vise surtout à tranformer la propriété `errors`
   * en une liste de strings qui ne poseront pas de problèmes.
   * @return un Array des erreurs
   */
  normalizeErrors(){
    if (typeof this.errors == 'string') this.errors = [this.errors]
    this.errors = this.errors.flatMap(error => {
      // error peut être :
      //    un string (mais sans assez d'espace)
      //    une paire [msg, params]
      if (Array.isArray(error)) {
        if (error.length == 2) {
          error = textSubstitute(...error)
        } else {
          error = error.join("\n")
        }
      }
      // On normalise tous les textes
      error = error.split(' ').flatMap( seg => {
        if (seg.length > MAX_LEN_STRING) {
          return seg.replace(/.{1,MAX_LEN_STRING}/g, "$& ")
        } else return seg
      }).join(' ')
      if (error.match(/\n/)) error = error.split("\n") 
      return error
    })
  }

}

class OKDialog extends Dialog {
  constructor(data) {
    super(data)
    this.ouiData = {name: 'OK', onclick: () => {} }
    this.nonData = null
    this.midData = null
  }

}

// Pour faire une fenêtre présentant un menu de choix (et seulement ça)
class SelectDialog extends Dialog {
  constructor(data){
    super(data)
    this.values = data.values
    this.content = this.buildMenu()
  }
  buildMenu(){
    const div = DCreate('DIV', {style: 'padding: 1em 1em 1em 3em;'})
    const select = DCreate('SELECT', {id: this.FId} )
    let indexOfDefault = 0
    const defVal = this.defaultValue
    div.appendChild(select)
    this.values.forEach((value, i) => {
      var tit, val
      if (Array.isArray(value)){
        [val, tit] = value
      } else {
        [tit, val] = [value, value]
      }
      if (indexOfDefault == 0 && (defVal === val || defVal === tit)) {
        indexOfDefault = i
      }
      const opt = DCreate('OPTION')
      opt.value = val
      opt.textContent = tit
      select.appendChild(opt)
    })
    select.selectedIndex = indexOfDefault

    return div
  }
}
// Pour faire une fenêtre présentant un textarea 
class TextareaDialog extends Dialog {
  constructor(data){
    super(data)
    this.content = this.buildField()
    this.onShow = ()=>{const tf = DGet(this.FDomId); tf.focus(); tf.select()}
  }

  buildField(){
    const div = DCreate('DIV', {style: 'padding: 1em;'})
    const input = DCreate('TEXTAREA', {id: this.FId, style: `width: 100%;height:${this.height ?? 200}px;`})
    console.log("value juste avant", String(this.default))
    input.value = this.defaultValue || this.default
    div.appendChild(input)
    listen(input, 'keydown', this.onKeyDown.bind(this))
    return div
  }

  onKeyDown(ev){
    ev.stopPropagation()
  }

}

// Pour faire une fenêtre présentant un champ de texte pour entrer une valeur
class TextFieldDialog extends Dialog {
  constructor(data){
    super(data)
    this.content = this.buildField()
    this.onShow = () => {
      const tf = DGet(this.FDomId)
      tf.focus(); tf.select()
    }
  }

  buildField(){
    const div = DCreate('DIV', {style: 'padding: 1em 1em 1em 3em;'})
    const input = DCreate('INPUT', {type: 'text', id: this.FId, style: 'width: 100%', value: this.default || this.defaultValue || ""})
    div.appendChild(input)
    listen(input, 'keydown', this.onKeyDown.bind(this))
    return div
  }
  onKeyDown(ev){
    ev.stopPropagation();
    if (ev.key == 'Enter') this.onOui(ev)
    return true 
  }
}

// Pour faire une fenêtre présentant un picker de couleur, avec aperçus
class ColorDialog extends Dialog {
  constructor(data){
    super(data)
    this.content = this.buildField()
  }

  buildField(){
    const div = DCreate('DIV', {style: 'padding: 1em;'})
    const color = this.defaultValue || '#ff0000'

    const input = DCreate('INPUT', {
        type: 'color', id: this.FId, value: color
      , style: 'display:block;margin:0 auto;width:120px;height:60px;border:none;padding:0;'
    })
    listen(input, 'input', this.onColorChange.bind(this))
    div.appendChild(input)

    const frame = DCreate('FIELDSET', {style: 'margin-top:1.5em;border:1px solid #999;border-radius:6px;padding:1em;'})
    frame.appendChild(DCreate('LEGEND', {text: 'Échantillons', style: 'padding:0 0.5em;color:#999;'}))

    const previews = DCreate('DIV', {style: 'display:flex;justify-content:space-around;align-items:center;'})

    // 1) texte de cette couleur sur blanc
    this.onWhite = DCreate('DIV', {text: 'Aa', style: `background:#fff;color:${color};padding:0.5em 1em;font-size:1.4em;`})
    // 2) le même sur noir
    this.onBlack = DCreate('DIV', {text: 'Aa', style: `background:#000;color:${color};padding:0.5em 1em;font-size:1.4em;`})
    // 3) un rond plein de cette couleur
    this.disc    = DCreate('DIV', {style: `width:64px;height:64px;border-radius:50%;background:${color};`})

    previews.appendChild(this.onWhite)
    previews.appendChild(this.onBlack)
    previews.appendChild(this.disc)
    frame.appendChild(previews)
    div.appendChild(frame)

    return div
  }

  onColorChange(ev){
    const color = ev.target.value
    this.onWhite.style.color      = color
    this.onBlack.style.color      = color
    this.disc.style.background    = color
  }
}



/**
 * Dialog pour gestion de LISTE DE TÂCHES
 */
class TasksDialog extends Dialog {
  constructor(data){
    super(data)
    this.width    = '800px'
    this.tasks    = data.tasks
    this.onCheck  = data.onCheck
    this.content  = this.buildTaskList()
    this.ouiData  = {name: 'OK', onclick: () => {
      data.onValidate.call(null, this.newTasks)
    }}
    this.nonData  = null
    this.midData  = {name: getMsg('New task...'), onclick: this.onCreateNewTask.bind(this), keep: true}
    this.newTasks = []
  }

  /**
   * Méthode appelée quand on clique sur le bouton "Nouvelle tâche…"
   * Elle ouvre un textarea pour entrer les nouvelles données.
   */
  onCreateNewTask(newTask){
    if (newTask) {
      console.log("retour onCreateNewTask", newTask)
      this.newTasks.push(newTask)
      this.list.appendChild(DCreate('DIV', {text: getMsg('todoist-text-new-task', [newTask.content])}))

    } else {

      this.BoiteTaskData = new TextareaDialog({
            title: getMsg('New task')
          , id: 'task-data-textarea'
          , width: '800px'
          , q: getMsg('todoist-message-new-task') + "\n\n"
          , default: MESSAGES['todoist-default-new-task']
          , ouiBtn: {name: 'OK', onclick: this._validateTaskBeforeSubmit.bind(this), keep: true}
          , nonBtn: {name: getMsg('Cancel')}
        })
      this.BoiteTaskData.show()
    }
  }
  /**
   ****************************************************************
   ***            VALIDATION DES INFORMATIONS                   ***
   */
  _validateTaskBeforeSubmit(ev){ D.on && D.trace(ev)
    const task = {}

    // Pour valider la donnée de tâche +key+ de valeur +val+ et
    // la mettre dans +task+ si elle est ok ou enregistrer l'erreur
    // dans +errors+
    const validateAndAdd = (key, val, errors, task) => {
      const nombreErreursBefore = Number(errors.length)
      this._validateByKey(key, val, errors)
      if ( errors.length == nombreErreursBefore) Object.assign(task, {[key]: val})
      // console.log("task dans validateAndAdd", task)
    }
    const contenu = DGet('#__task-data-textarea__').value
    const errors = []
    var line, val, key, segs, lines = contenu.trim().split("\n")
    while((line = lines.shift()) !== undefined) {
      if (key == 'description'){
        if (line.match(/^[a-z]+\:/) /* nouvelle clé */) {
          // On peut donc valider la description
          validateAndAdd('description', val, errors, task)
        } else {
          val += "\n" + line
          continue
        }
      }
      segs  = line.split(':')
      key   = segs.shift().trim() // TODO clé inconnue => content (cas où content n'est pas mis, mais où la ligne contient ":")
      val   = segs.join(':').trim()
      // Pour une description (multi-line) le check se fait plus tard (ci-dessus)
      key == 'description' || validateAndAdd(key, val, errors, task)
    }

    // Si la tâche est ok, on peut l'ajouter
    if (errors.length) {
      new ErrorsDialog({
        title:getMsg('todoist-new-task-title-errors') 
        , q: getMsg('todoist-new-task-msg-correct-errors') + aide('todoist')
        , errors
      }).show()
    } else {
      // Keep:true oblige à forcer la fermeture de la boite
      console.log("Données tâches valides, fermeture de la boite et création")
      this.BoiteTaskData.hide()
      this.onCreateNewTask(task)
    }
  }
  // Validation par clé
  _validateByKey(key, val, errors){
    // console.log("[_validateByKey] key, val, errors", {key, val, errors})
    switch(key) {
      case 'content':
        if (val == '') errors.push(getErr('prop-cant-be-empty', ['content']))
        return
      case 'description': return // idem
      case 'start':       return Validator.date(val, errors)
      case 'deadline':
        Validator.date(val, errors)
        return Validator.dateAfter('/* on doit avoir la date start */', val, errors)
      case 'duration':    return Validator.duration(val, errors)
      case 'priority':    if(!val.match(/^[1-5]$/)){errors.push(getErr('must-be-num-between', [val, 1, 5]))}
      case 'labels':      return
      default: 
        errors.push(getErr('todoist-key-task-unknown', key))
    }
    return 
  }

  buildTaskList(){
    this.list = DCreate('DIV', {class: 'task-list'})
    this.tasks.forEach(task => {
      const liId  = `todoist-task-${task.id}`
      const li    = DCreate('DIV', {id: liId, class: 'task-li'})
      const cbId  = `${liId}-cb`
      const cb    = DCreate('INPUT', {id: cbId, type:'checkbox'})
      listen(cb, 'click', this.onCheck.bind(this, task))
      const span  = DCreate('LABEL', {for: cbId, text: task.content})
      li.appendChild(cb)
      li.appendChild(span)
      this.list.appendChild(li)
    })
    return this.list
  }
}
