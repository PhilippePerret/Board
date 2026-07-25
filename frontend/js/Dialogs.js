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
    this.errors = data.errors ?? ''
    console.log("errors au départ", this.errors)
    this.content = this.buildContainerErrors()
    if (data.ouiBtn && 'function' == data.ouiBtn.onclick) {
      this.nonData = {name: 'Finir'}
    } else {
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
    const input = DCreate('TEXTAREA', {id: this.FId, style: `width: 100%;height:${this.height ?? 200}px;`, value: this.defaultValue})
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
