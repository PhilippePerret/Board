/**
 * ExtendedObject
 * v.1.0.0
 * 
 * Pour les opérations classiques sur les objets
 * 
 */
class ExtendedObject {

  /**
   * @api
   */
  count(){ return this.__eo_items.length }

  /**
   * @api
   * 
   * Retourne la liste des objets
   */
  asArray(){ return this.__eo_items }

  /**
   * @api
   * 
   * Retourne la liste des objets comme table
   */
  asDict(){ return this._eo_table }

  /**
   * @api
   * 
   * Boucle la méthode +method+ sur tous les objets.
   * 
   * @param method    SOIT [String] une méthode de l'objet
   *                  SOIT [Function] une méthode quelconque recevant l'objet en premier argument
   * @param args      [Array] Les arguments à transmettre
   */
  each(method, args = []){
    if ( this.count == 0 ) return
    if ( 'string' == typeof method ) {
      this.__eo_items.forEach(item => item[method].call(item, ...args))
    } else {
      this.__eo_items.forEach(item => method(item, ...args))
    }
  }

  init(){
    this.__eo_items = []
    this.__eo_ids   = []
    this.__eo_table = {}
    this.__eo_lastId = 0
  }
  nextId(){
    return ++this.__eo_lastId
  }
  add(item){
    this.__eo_items.push(item)
    this.__eo_ids.push(item.id)
    Object.assign(this.__eo_table, {[item.id]: item})
  }
  
  // Obtenir l'objet par l'identifiant
  get(itemId){ return this.__eo_table[itemId] }

  // Obtenir l'objet par la valeur +value+ de la propriété +prop+
  getBy(prop, value) { return this.__eo_items.filter(item => item[prop] = value)}
  
  remove(item) {
    const itemId = item.id
    delete this.__eo_table[itemId]
    const idx = this.__eo_ids.indexOf(itemId)
    this.__eo_items.splice(idx, 1)
    this.__eo_ids.splice(idx, 1)
  }

  constructor(data){
    // Dispatch des données transmises
    this.data = data
    for (var prop of Object.getOwnPropertyNames(data)) {
      this[prop] = data[prop]
    }
    this.id ?? (this.id = this.constructor.nextId());
    this.constructor.add(this)

  }
}
ExtendedObject.init() // Est-ce que ça fonctionne pour tous ?