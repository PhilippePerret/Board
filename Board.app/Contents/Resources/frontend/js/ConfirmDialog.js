class ConfirmDialog extends Panel {

  constructor(data){
    super(data)
  }
}

class SelectDialog extends Panel {
  constructor(data){
    data.content = this.buildMenu()
    super(data)
  }
  buildMenu(){
    const div = DCreate('DIV')
    const select = DCreate('SELECT')
    div.appendChild(select)
    this.values.forEach(value => {
      const opt = DCreate('OPTION')
      opt.value = value
      opt.textContent = value
      select.appendChild(opt)
    })

    return div
  }
}