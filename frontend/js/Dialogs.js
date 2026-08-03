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
    this.ouiData = {name: 'OK', onclick: null }
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
    const input = DCreate('INPUT', {type: 'text', id: this.FId, style: 'width: 100%', value: this.default ?? this.defaultValue ?? ""})
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
 * Dialog complexe pour gestion de liste de propriétés
 * 
 * Dans le style du panneau :config de Firefox
 * 
 * Chaque ligne est une +prop+ qui peut avoir différents
 * types :
 * 
 *    string      Une chaine
 *    boolean     Une valeur booléenne (coché/décoché)
 *    integer     Un nombre
 * 
 * Les données modifiées (et seulement celles-là), sont tranmises en premier
 * argument de la méthode bindée au bouton "Oui"/"Enregistrer"
 */
class ConfigDialog extends Dialog {
  constructor(data){
    super(data)
    data.id ?? raise("Il faut absolumenent définir un ID pour un dialog de type ConfigDialog")
    if (undefined == data.width) this.width = '840px'
    this.height   = '500px'
    this.props    = data.props
    this.modos    = [] // Contiendra les modifications/array de {id, value}
    this.content  = this.buildConfig()
    this.ouiData  = Object.assign(this.ouiData, {onclick: this.ouiData.onclick.bind(null, this.modos)})
    if (undefined == data.nonBtn) {
      this.nonData = {name: getMsg('Cancel')}
    }
  }

  onShow(){
    // Après la construction, on s'assure que les valeurs ne dépassent pas
    // Si c'est le cas, on raccourcit jusqu'à obtenir la bonne valeur et on
    // ajoute une ellipse (…).
    this.props.forEach(dprop => {
      if (!['url', 'path'].includes(dprop.type)) return
      const el = DGet(`#${this.id}-${dprop.id}-value`)
      // console.log("width et scroll", {width: el.clientWidth, scroll: el.scrollWidth })
      // console.log(" el.scrollWidth > el.clientWidth est", el.scrollWidth > el.clientWidth)
      var isTooLong = false
      while ( el.scrollWidth > el.clientWidth ) {
        isTooLong = true
        el.textContent = el.textContent.slice(1)
      }
      if ( isTooLong ) {
        el.textContent = '…' + el.textContent.slice(2)
      }
    })
  }


  buildConfig(){
    const container = DCreate('DIV', {id: `${this.FId}-container`, class: 'config-dialog-container'})
    this.props.forEach(dprop => {
      // console.log("dprop = ", dprop)
      if ( dprop.editable === false ) return
      const prefixId = `${this.id}-${dprop.id}`
      const line = DCreate('DIV', {id: `${prefixId}-line`, class: 'config-data-prop'})
      const name = DCreate('SPAN', {id: `${prefixId}-name`, text: dprop.name || dprop.id, class: 'config-data-name'})
      const desc = DCreate('SPAN', {id: `${prefixId}-desc`, text: dprop.desc || '', class: 'config-data-desc'})
      var dispValue = dprop.value ?? ''
      if ( dprop.type == 'path' && this.project && dprop.id != 'path') {
        // Si la valeur est un path, on essaie de la réduire
        dispValue = dispValue.replace(this.project.path, '.')
      }
      const valu = DCreate('SPAN', {id: `${prefixId}-value`, text: dispValue, class: 'config-data-value'})
      listen(valu, 'click', (ev) => {
        const callback = (values) => {
          console.log("values reçues", values)
          if (values != null) {
            // On applique la modification à la liste des données
            dprop.value = values[0].value // si réédité, pour valeur par défaut
            this.modos.push({id: dprop.id, value: dprop.value})
            // Ci-dessus, un même paramètre peut être redéfini, mais peu importe
            // Et on la met dans le tableau
            valu.innerHTML = dprop.value
          }
        }
        new ParamsDefiner([Object.assign(dprop, {default: dprop.value})], callback).define()
      })
      line.appendChild(name)
      line.appendChild(desc)
      line.appendChild(valu)
      container.appendChild(line)
    })
    return container
  }
}

/**
 * Dialog complexe pour gestion complète de LISTE DE TÂCHES
 * 
 * Permet de créer de nouvelles tâches facilement.
 */
class TasksDialog extends Dialog {
  constructor(data){
    super(data)
    this.width    = '800px'
    this.tasks    = data.tasks
    this.onCheck  = (task, ev) => {this.getLastCheck(task, ev); data.onCheck(task, ev)}
    this.content  = this.buildTaskList()
    this.ouiData  = {name: 'OK', onclick: () => {
      data.onValidate.call(null, this.newTasks)
    }}
    this.midData  = {name: getMsg('todoist-modify-checked'), onclick: this.onModifyCheckedTask.bind(this), keep: true}
    this.nonData  = {name: getMsg('New task...'), onclick: this.onCreateNewTask.bind(this), keep: true}
    this.newTasks = []
  }

  getLastCheck(task, ev){
    if (undefined == this.__checks) { this.__checks = []}
    this.__checks.push(task)
  }

  /**
   * Méthode appelée quand on cique sur le bouton pour modifier la
   * tâche cochée
   */
  onModifyCheckedTask(retour){
    if ( !this.__checks ) return erreur("Aucun tâche cochées")
    else if (this.__checks.length > 1) {
      erreur("Il faut cocher seulement la tâche à modifier.")
    } else {
      const task = this.__checks[0]
      this.__checks = []
      // On la décoche
      DGet(`#todoist-task-${task.id}-cb`).checked = false
      // Mettre en forme la donnée
      var repeat = '';
      if (task.due.is_recursing) {
        repeat = task.due.string
      }
      this.onEditNewTask(getMsg('todoist-default-fields-task', [
          task.content
        , task.description || ''
        , task.due.date
        , repeat
        , task.duration || ''
        , task.priority || ''
        , task.deadline || ''
        , task.labels   || ''
      ]) + `\nID: ${task.id}`, task)
    }
  }

  /**
   * Méthode appelée quand on clique sur le bouton "Nouvelle tâche…"
   * OU quand on revient de l'édition.
   * Elle ouvre un textarea pour entrer les nouvelles données.
   * 
   * NOTE : La fonction porte mal SON NOM puisqu'elle sert aussi à
   * l'édition de la tâche
   */
  onCreateNewTask(task /* nouvelle ou modifiée */){
    if (task ) {
      console.log("retour onCreateNewTask", task )
      const msgId = task.ID ? 'todoist-text-mod-task' : 'todoist-text-new-task'
      this.list.appendChild(DCreate('DIV', {text: getMsg(msgId, [task .content])}))
      this.newTasks.push(task)

    } else {
      this.onEditNewTask(
          getMsg('todoist-default-fields-task', ['', '', getMsg('todoist-default-due-task'), '', '', '1-5', '', 'lab 1, lab 2, ...'])
        , null
      )
    }
  }
  onEditNewTask(dataTaskStr, task /* seulement si modification */){
    const message = getMsg(task ? 'todoist-message-mod-task' : 'todoist-message-new-task')
    this.BoiteTaskData = new TextareaDialog({
          title: getMsg('New task')
        , id: 'task-data-textarea'
        , width: '800px'
        , q: message + "\n\n"
        , default: dataTaskStr
        , ouiBtn: {name: 'OK', onclick: this._validateTaskBeforeSubmit.bind(this), keep: true}
        , nonBtn: {name: getMsg('Cancel')}
      })
    this.BoiteTaskData.show()
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
    let validateAndAdd = (key, val, errors, task) => {
      const nombreErreursBefore = Number(errors.length)
      // Validation par de et par la clé, qui est aussi transformée
      // en sa valeur absolu (anglaise/todoist)
      var [angKey, angVal] = this._validateByKey(key, val, errors)
      if ( errors.length == nombreErreursBefore) Object.assign(task, {[angKey]: angVal})
      // console.log("task dans validateAndAdd", task)
     return [angKey, angVal]
    }
    const contenu = DGet('#__task-data-textarea__').value
    const errors = []
    var line, val, key, segs, lines = contenu.trim().split("\n")
    while((line = lines.shift()) !== undefined) {
      if (key == 'description'){
        if (line.match(/^[a-z]+\:/) /* nouvelle clé */) {
          // On peut donc valider la description
          [key, val] = validateAndAdd('description', val, errors, task)
        } else {
          val += "\n" + line
          continue
        }
      }
      segs  = line.split(':')
      key   = segs.shift().trim() // TODO clé inconnue => content (cas où content n'est pas mis, mais où la ligne contient ":")
      val   = segs.join(':').trim()
      // Pour une description (multi-line) le check se fait plus tard (ci-dessus)
      if (key != 'description') {
        [key, val] = validateAndAdd(key, val, errors, task)
      }
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
      // console.log("Données tâches valides, fermeture de la boite et création")
      this.BoiteTaskData.hide()
      this.onCreateNewTask(task)
    }
  }
  // Validation par clé
  get _content_(){ return this._content || (this._content = getMsg('todoist-content'))}
  get _description_(){return this._description || (this._description = getMsg('todoist-description'))}
  get _due_(){ return this._due ||(this._due = getMsg('todoist-due'))}
  get _deadline_(){return this._deadline || (this._deadline = getMsg('todoist-deadline'))}
  get _duration_(){ return this._duration || (this._duration = getMsg('todoist-duration'))}
  get _priority_(){return this._priority || (this._priority = getMsg('todoist-priority'))}
  get _labels_(){return this._labels || (this._labels = getMsg('todoist-labels'))}
  get _repeat_(){return this._repeat || (this._repeat = getMsg('todoist-repeat'))}

  _validateByKey(key, val, errors){
    // console.log("[_validateByKey] key, val, errors", {key, val, errors})
    switch(key) {
      case 'ID': return ['ID', val]
      case 'content': case this._content_:  if (val == '') errors.push(getErr('prop-cant-be-empty', ['content']))
                                            return ['content', val]
      case 'description': case this._description_: return ['description', val] // idem
      case 'due':         case this._due_ : 
        Validator.date(val, errors)
        return ['due', val]
      case 'deadline':    case this._deadline_  : 
        Validator.date(val, errors)
        Validator.dateAfter('/* on doit avoir la date start */', val, errors)
        return ['deadline', val]
      case 'duration':    case this._duration_  : 
        Validator.duration(val, errors)
        return ['duration', val]
      case 'priority':    case this._priority_  : 
        if(!val.match(/^[1-5]$/)){ errors.push(getErr('must-be-num-between', [val, 1, 5])) }
        return ['priority', val]
      case 'labels':      case this._labels_    :
        return ['labels', val]
      case 'repeat'     : case this._repeat_    : 
        Validator.repeat(val, errors)
        return ['repeat', val]
      default: 
        errors.push(getErr('todoist-key-task-unknown', key))
        return [key, val]
    }
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
