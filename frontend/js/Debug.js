/**
 * Module de débuggage
 * 
 * Utiliser 
 *    D.add( message [, paramètres ])
 *    D.start()       # pour commencer à débuggerr
 *    D.stop()        # pour arrêter de débugger
 *    D.show/hide() pour afficher
 * 
 *    D.on && D.trace(fonction, params)   et D.outputTrace() pour suivre
 */
const relativePath = 'file:///Users/philippeperret/Programmes/Board/Board.app/Contents/Resources/frontend/js'
class Debug {

  constructor() {
    this.logs = []
    this.debugging = false
    this.closed = true
    this.tracer = []
  }
  add(msg, params) {
    if (this.debugging) {
      this.logs.push(new Log(msg, params))
    }
  }
  trace(args, classe){
    const plainLine = new Error().stack.split("\n")[1]
    const [method, lieu, line, col] = plainLine.replace(relativePath, '').split(/[@:]/)
    this.tracer.push([`${classe ? classe : ''}${method}`, args, `${method} in ${lieu}:${line}`, plainLine])
  }
  outputTrace(){
    console.info("TRACER")
    console.info(this.tracer)
  }

  start() {
    this.on = true
    this.debugging = true 
    this.time = new Date()
  }
  stop()  {
    this.on = false
    this.debugging = false
  }

  toggle(){
    this[this.closed?'show':'hide']()
  }
  show(){
    this.build()
    this.panel.classList.remove('hidden')
    this.closed = false
  }
  hide() {
    this.panel.classList.add('hidden')
    this.closed = true
  }

  build(){
    const alreadyBuilt = !!(this.panel = DGet('#debug-panel'))
    if ( alreadyBuilt ) {
      this.panel.innerHTML = ''
    } else {
      this.panel = DCreate('DIV', {id:'debug-panel', class:'panel hidden'})
    }
    const div = DCreate('DIV', {class: 'debug'})
    this.logs.forEach(log => div.appendChild(log.build()))
    this.panel.appendChild(div)
    alreadyBuilt || document.body.appendChild(this.panel)
  }
}

const D = new Debug()

class Log {
  constructor(msg, params){
    this.time = new Date()
    this.msg = msg
    this.params = params
  }
  build(){
    const div = DCreate('DIV', {class: 'log'})
    const spanTime = DCreate('SPAN', {class:'time', text: this.formatedTime})
    const spanMess  = DCreate('SPAN', {class:'msg', text: textSubstitute(this.msg, this.params)})
    div.appendChild(spanTime)
    div.appendChild(spanMess)
    return div
  }
  get formatedTime(){
    const d = this.time;
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}:${String(d.getMilliseconds()).padStart(3, '0')}`;
  }
}

