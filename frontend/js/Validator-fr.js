/**
 * Validateur de date pour la langue française
 */
const dateDel = "[ :\\-\\/]"
// Reg pour une heure
// Peut s'exprimer par "10:32" comme "10 hrs 32" ou "10 heures"
const heureReg = "[0-9]{1,2} ?(:|heure|hr|h)s? ?([0-9]{1,2})?"
const dateReg = new RegExp(`^(le )?[0-9]{1,2}${dateDel}[0-9]{1,2}(${dateDel}[0-9]{2,4})?( à ${heureReg})?$`)

const dateUnit = "(mois|semaine|sem|jour|jr|j|heure|hr|h|minute|min|mn)s?"
const dureeReg = new RegExp(`^([0-9]+) ${dateUnit}$`)
const dateDansReg = new RegExp(`^dans ([0-9]+) ${dateUnit}?( à ${heureReg})?$`)

class Validator {

  /**
   * Réflexion sur date qui peut être "dans 3 jours à 20 heures" ou "demain à 10:20"
   * et puis la récurrence : "tous les jours à 10 h" "toutes les trois semains"
   */


  /**
   * Check étendu de la date
   */
  static date(date, errors){
    var err
    if (date.match(dateReg)){
      // Formats JJ/MM/AAAA et dérivés
      return
    } else if (date.match(/hier|avant\-hier|après\-demain|demain|dem|aujourd'hui|auj/) ){
      return
    } else if (date.match(dateDansReg)) {
      // Formats "dans x jour/mois, etc."
    } else {
      err = `La date ${date} est invalide. Formats valide : JJ/MM/AAAA et les dérivés ou "demain", "après-demain", ou "dans x heures/jours/semaines/mois"`
    }
    return this._retErr(errors, err)
  }

  /**
   * Check d'une durée
   */
  static duration(duree, errors){
    var err
    if (!duree.match(dureeReg)){
      err = getErr('error-duration', [duree])
    }
    return this._retErr(errors, err)
  }

  /**
   * Check d'une répétition
   * 
   * Peut avoir les formes : 
   * 
   *    le 10
   *    tous les 10 du mois
   *    le mardi à 10 heures
   *    tous les jours — tous les jours à 11 heures
   * 
   */
  static repeat(val, errors){
    var err, date, heure
    if (val.match(' à ')) [val, heure] = val.split(' à ')
    if (val.startsWith('tous les ')) val = val.replace(/^tous les/, '')
    // 10 du mois, jours, mardi
    var ok = val.match(/[0-9]{1,2} jours/) || val.match(/lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche/) || val.match(/[0-9]{1,2} du mois/)
    if (!ok) { 
      err = getErr('repeat-not-valid', valInit) 
    } else if (heure && !heure.match(heureReg)){ 
      err = getErr('hour-not-valid', [heure])
    }
    return this._retErr(errors, err)
  }
  
  // OK si +dateAfter+ est bien après +dateRef+
  static dateAfter(dateAfter, dateRef, errors) {
    var err
    // Il faut pouvoir transforme les dates-string en vraies dates
    return this._retErr(errors, err)
  }


  /**
   * Fonction de retour
   * 
   * @usage
   *  à la fin de toutes les fonctions : return this.retErr(errors, err)
   *  Copier-coller : return this._retErr(errors, err)
   * 
   * SI err n'est pas défini (i.e. pas d'erreur) on ne retourne rien
   * SI err est défini mais pas errors, on retourne l'erreur
   * SI err est défini et errors, on met err dans errors et on retourne false
   */
  static _retErr(errors, err){
    if (err) {
      if (errors) {
        errors.push(err)
        return false
      } else {
        return err
      }
    }
  }
}