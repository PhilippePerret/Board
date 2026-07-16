class ConfirmDialog extends Dialog {

  constructor(data){
    super(data)
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
    const select = DCreate('SELECT', {id: '__' + this.id + '__'} )
    let firstValue = null
    div.appendChild(select)
    this.values.forEach(value => {
      var tit, val
      const opt = DCreate('OPTION')
      if (Array.isArray(value)){
        [val, tit] = value
      } else {
        [tit, val] = [value, value]
      }
      if ( firstValue == null ) firstValue = val
      opt.value = val
      opt.textContent = tit
      select.appendChild(opt)
    })

    select.value = this.defaultValue || firstValue
    select.selectedIndex = 0

    return div
  }
}
// Pour faire une fenêtre présentant un textarea 
class TextareaDialog extends Dialog {
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
class TextFieldDialog extends Dialog {
  constructor(data){
    super(data)
    this.content = this.buildField()
    this.returnedIdValues = [...(this.returnedIdValues ?? []), this.id]
    this.onShow = () => {
      const tf = DGet(`#__${this.id}__`)
      console.log("tf = ", tf)
      tf.focus(); tf.select()
    }
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

// Pour faire une fenêtre présentant un picker de couleur, avec aperçus
class ColorDialog extends Dialog {
  constructor(data){
    super(data)
    this.content = this.buildField()
    this.returnedIdValues = [...(this.returnedIdValues ?? []), this.id]
  }

  buildField(){
    const div = DCreate('DIV', {style: 'padding: 1em;'})
    const color = this.defaultValue || '#ff0000'

    const input = DCreate('INPUT', {
        type: 'color', id: '__' + this.id + '__', value: color
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
