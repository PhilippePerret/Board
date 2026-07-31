/**
 * ExtendedObject
 * v.1.0.0
 * 
 * Pour les opérations classiques sur les objets
 * 
 * ATTENTION : Les classes filles doivent appeler <classe>.init()
 * 
 */
class ExtendedObject {

  /**
   * @api
   */
  static get count(){ return this.__eo_items.length }

  /**
   * @api
   * 
   * Retourne la liste des objets
   */
  static asArray(){ return this.__eo_items }

  /**
   * @api
   * 
   * Retourne la liste des objets comme table
   */
  static asDict(){ return this._eo_table }

  /**
   * @api
   * 
   * Boucle la méthode +method+ sur tous les objets.
   * 
   * @param method    SOIT [String] une méthode de l'objet
   *                  SOIT [Function] une méthode quelconque recevant l'objet en premier argument
   * @param args      [Array] Les arguments à transmettre
   */
  static each(method, args = []){
    // console.log("-> ExtendedObject::each", {method, count: String(this.count)})
    if ( this.count == 0 ) return
    if ( 'string' == typeof method ) {
      this.__eo_items.forEach(item => item[method].call(item, ...args))
    } else {
      this.__eo_items.forEach(item => method(item, ...args))
    }
  }

  static init(){
    this.unenableUndefinedId = true // mettre à false pour autoriser les id non définis
    this.__eo_items = []
    this.__eo_ids   = []
    this.__eo_table = {}
    this.__eo_lastId = 0
  }
  static nextId(){
    return ++this.__eo_lastId
  }
  static add(item){
    console.log("ExtendedObject::add", item)
    this.__eo_items.push(item)
    this.__eo_ids.push(item.id)
    Object.assign(this.__eo_table, {[item.id]: item})
  }
  
  // Obtenir l'objet par l'identifiant
  static get(itemId){ return this.__eo_table[itemId] }

  // Obtenir l'objet par la valeur +value+ de la propriété +prop+
  static getBy(prop, value) { return this.__eo_items.filter(item => item[prop] = value)}
  
  static remove(item) {
    const itemId = item.id
    delete this.__eo_table[itemId]
    const idx = this.__eo_ids.indexOf(itemId)
    this.__eo_items.splice(idx, 1)
    this.__eo_ids.splice(idx, 1)
    console.info("this.__eo_items", this.__eo_items)
    console.info("this.__eo_ids", this.__eo_ids)
  }



  constructor(data){
    // Dispatch des données transmises
    this.data = data
    for (var prop of Object.getOwnPropertyNames(data)) {
      this[prop] = data[prop]
    }
    if (undefined == this.id && this.constructor.unenableUndefinedId ){ 
      this.id = this.constructor.nextId()
    }
    this.constructor.add(this)

  }
}
ExtendedObject.init() // Est-ce que ça fonctionne pour tous ?