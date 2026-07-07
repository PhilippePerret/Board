class ConfirmDialog extends Panel {

  constructor(data){
    super(data)
  }
}

// Pour faire une fenêtre présentant un menu de choix (et seulement ça)
class SelectDialog extends Panel {
  constructor(data){
    super(data)
    this.values = data.values
    this.content = this.buildMenu()
  }
  buildMenu(){
    const div = DCreate('DIV', {style: 'padding: 1em 1em 1em 3em;'})
    const select = DCreate('SELECT', {class: this.id})
    div.appendChild(select)
    this.values.forEach(value => {
      var tit, val
      const opt = DCreate('OPTION')
      if (Array.isArray(value)){
        [val, tit] = value
      } else {
        [tit, val] = [value, value]
      }
      opt.value = val
      opt.textContent = tit
      select.appendChild(opt)
    })

    return div
  }
}