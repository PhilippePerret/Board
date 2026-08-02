
/**
 * Classe qui permet de définir des paramètres
 * (paramètres tel que définis dans params des Services par exemple)
 *
 * Utilisation
 * ------------
 * on crée une instance ParamsDefiner en lui transmettant en premier
 * argument, une liste des paramètres redéfinir, tel que défini dans
 * les listes de paramètres de l'application, du projet, du service,
 * etc., et en second argument, la fonction callback qui devra être
 * appelée en fin de processus.
 *
 * La fonction +callback+ reçoit en fin de processus la liste des
 * instances ParamDefiner qui correspondent à chaque paramètre. Il
 * suffit de passer en revue cette liste en récupérant l'identifiant
 * (id) et la valeur (value) pour obtenir les valeurs définies.
 *
 * L'obtention de la valeur elle-même (dialogue, lecture projet, appel
 * serveur…), selon le type du paramètre, est entièrement déléguée à
 * Prompter (cf. Prompter.js) : ParamDefiner ne connaît jamais le
 * détail de cette obtention, seulement le résultat.
 */

class ParamsDefiner {
  /**
   * @param params Array des paramètres (p.e. {id: 'mon-id', name: 'Nome' ………})
   * @param callback Function à appeler enfin de processus avec la liste des
   *                  ParamDefiner créer pour chaque paramètre.
   */
  constructor(params, callback){
    this.params   = [...params].reverse()
    this.definers = []
    this.callback = callback
  }
  define(){
    historize('-> ParamsDefiner.define', this)
    const param = this.params.pop()
    if (param) {
      const thedefiner = new ParamDefiner(this, param)
      this.definers.push(thedefiner)
      thedefiner.define()
    } else {
      this.resolve()
    }
  }

  abort(){
    this.callback(null)
    return error('Définition abandonnée')
  }
  resolve(){
    historize('-> ParamsDefiner.resolve', this)
    this.callback(this.definers)
  }
}

/**
 * DÉFINITION D'UN PARAMÈTRES
 */
class ParamDefiner {

  constructor(paramLister, param){
    this.paramLister = paramLister
    console.log("param dans constructeur", param)
    this.param    = param
    this.id       = param.id      ?? raise('Un identifiant est obligatoire.', param)
    this.name     = param.name    ?? param.id
    this.type     = param.type    ?? raise('Le type doit être défini.', param)
    this.q        = param.q       ?? null
    this.message  = param.message ?? this.q ?? null
    this.default  = param.default ?? null
    this.actual   = param.actual  ?? null // valeur en vigueur, distincte de default
    this.values   = param.values  ?? null
  }

  get currentOrDefault(){ return this.actual ?? this.default }

  define() {
   historize('-> ParamDefiner.define', this)
   Prompter.prompt(this.promptSpec(), this.onPrompted.bind(this))
  }

  // Données transmises à Prompter pour obtenir la valeur de ce paramètre
  promptSpec(){
    let defaultValue = this.currentOrDefault
    if (this.param.useLastAsDefault) {
      // this.paramLister.definers contient déjà ce definer (poussé avant
      // define() par ParamsDefiner#define) : l'avant-dernier est le param précédent
      const previous = this.paramLister.definers[this.paramLister.definers.length - 2]
      if (previous) defaultValue = previous.value
    }
    // this.param : uniquement les champs réellement déclarés pour ce
    // paramètre (values, key_value, key_title, if_undefined…) partent
    // tels quels. Seuls les champs à logique de repli (name, message,
    // default, actual) sont recalculés explicitement.
    return Object.assign({}, this.param, {
        type:     this.type
      , id:       this.id
      , name:     this.name
      , message:  this.message
      , default:  defaultValue
      , actual:   this.actual
      , ifUndefined: this.param.if_undefined
    })
  }

  onPrompted(value, error){
    if (error) { console.error(error); return }
    this.onNonButton(value)
  }

  setValue(value){
    this.value = value
    this.paramLister.define()
  }
  // Méthode appelée quand on renonce, qu'on fait non, ou par Prompter avec value=null
  onNonButton(value) {
    if ( value === null ) {
      this.abort()
    } else {
      this.setValue(value)
    }
  }

  // Pour abandonner les définitions
  abort(){
    this.value = '--aborted--'
    this.paramLister.abort() // interrompra la définition sans rien faire
  }

}
