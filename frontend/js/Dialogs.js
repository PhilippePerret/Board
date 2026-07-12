class ConfirmDialog extends Panel {

  constructor(data){
    super(data)
  }
}

// Pour faire une fenêtre présentant un textarea 
class TextareaDialog extends Panel {
  constructor(data){
    super(data)
    this.content = this.buildField()
    this.returnedIdValues = [...(this.returnedIdValues ?? []), this.id]
    this.onShow = ()=>{const tf = DGet(`#__${this.id}__`); tf.focus(); tf.select()}
  }

  buildField(){
    const div = DCreate('DIV', {style: 'padding: 1em;'})
    const input = DCreate('TEXTAREA', {id: '__' + this.id + '__', style: `width: 100%;height:${this.height ?? 200}px;`, value: this.defaultValue})
    div.appendChild(input)
    listen(input, 'keydown', this.onKeyDown.bind(this))
    return div
  }

  onKeyDown(ev){
    ev.stopPropagation()
  }

}

// Pour faire une fenêtre présentant un champ de texte pour entrer une valeur
class TextFieldDialog extends Panel {
  constructor(data){
    super(data)
    this.content = this.buildField()
    this.returnedIdValues = [...(this.returnedIdValues ?? []), this.id]
    this.onShow = ()=>{const tf = DGet(`#__${this.id}__`); tf.focus(); tf.select()}
  }

  buildField(){
    const div = DCreate('DIV', {style: 'padding: 1em 1em 1em 3em;'})
    const input = DCreate('INPUT', {type: 'text', id: '__' + this.id + '__', style: 'width: 100%', value: this.defaultValue})
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

// Pour faire une fenêtre présentant un menu de choix (et seulement ça)
class SelectDialog extends Panel {
  constructor(data){
    super(data)
    this.values = data.values
    this.content = this.buildMenu()
  }
  buildMenu(){
    const div = DCreate('DIV', {style: 'padding: 1em 1em 1em 3em;'})
    const select = DCreate('SELECT', {id: '__' + this.id + '__'} )
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