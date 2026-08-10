/**
 * Validator/Validator.js
 * Validation localisée des dates/durées/répétitions saisies pour Todoist.
 * Les mots et gabarits propres à chaque langue viennent de MESSAGES.js
 * (clés préfixées 'regexp:', jamais appelées avec des params de substitution).
 */
const dateDel = "[ :\\-\\/]"

// Mot(s) reliant heure et minutes ("heure", "hour", "h"...), en plus de ":"
const heureReg = `[0-9]{1,2} ?(:|${getMsg('regexp:hour-words')})s? ?([0-9]{1,2})?`

const dateReg = new RegExp(`^(${getMsg('regexp:date-prefix')})?[0-9]{1,2}${dateDel}[0-9]{1,2}(${dateDel}[0-9]{2,4})?( ${getMsg('date/at')} ${heureReg})?$`)
const dateReg8601 = /[0-9]{4}\-[0-9]{2}\-[0-9]{2}/
const relativeDaysReg = new RegExp(getMsg('regexp:relative-days'))

const dateUnit = `(${getMsg('regexp:date-unit')})s?`
const dureeReg = new RegExp(`^([0-9]+) ?${dateUnit}$`)
const dateDansReg = new RegExp(`^${getMsg('regexp:duration-in')}( ${getMsg('date/at')} ${heureReg})?$`)

// Retourne [Jour, Mois, Heure, Minutes] ou [Heure, Minute]
const REG_DATETIME_JJ_MM_HH_MM = /^(?:([0-9]{1,2})[ \-]([0-9]{2}) )?([0-9]{1,2}):([0-9]{1,2})$/

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
    } else if (date.match(dateReg8601)) {
      // Iso 8601
      return
    } else if (date.match(relativeDaysReg) ){
      return
    } else if (date.match(dateDansReg)) {
      // Formats "dans x jour/mois, etc."
    } else {
      err = getErr('error-date', [date])
    }
    return this._retErr(errors, err)
  }

  /**
   * @api
   *
   * Validation d'une datetime en envoyant l'expression
   * régulière correspondante.
   *
   * @return {day, month, hour, minute}
   */
  static datetime(str, reg, asDate = false){
    reg = reg ?? REG_DATETIME_JJ_MM_HH_MM
    if ('string' == typeof reg) {
      // TODO
      raise("Je dois apprendre à transformer JJ MM HH:MM en expression régulière.")
      reg = this.stringDatetimeToRegExp(reg)
    }
    var found, day, month, hour, minute
    if ( found = str.match(reg) ) {
      found = found.slice(1)
      ;[day, month, hour, minute] = found.map( n => {
        if ('string' == typeof n) return parseInt(n, 10)
      })
      if ( asDate ) {
        if ( month ) month = month - 1
        const d = new DateUtils()
        return new Date(d.year, (month || d.month), day || d.day, hour, minute, 0)
      } else {
        return {day, month, hour, minute}
      }
    } else {
      return null
    }
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
    var err, heure
    const valInit = val
    const dateAt = getMsg('date/at')
    if (val.match(` ${dateAt} `)) [val, heure] = val.split(` ${dateAt} `)
    const everyPrefix = getMsg('regexp:every-prefix')
    if (everyPrefix && val.startsWith(everyPrefix)) val = val.slice(everyPrefix.length)
    // 10 du mois, jours, mardi
    var ok = val.match(new RegExp(`[0-9]{1,2} ${getMsg('regexp:day-word')}`))
          || val.match(new RegExp(getMsg('regexp:weekdays')))
          || val.match(new RegExp(`[0-9]{1,2} ${getMsg('regexp:of-month')}`))
    if (!ok) {
      err = getErr('repeat-not-valid', valInit)
    } else if (heure && !heure.match(new RegExp(heureReg))){
      err = getErr('hour-not-valid', [heure])
    }
    return this._retErr(errors, err)
  }

  // OK si +dateAfter+ est bien après +dateRef+
  static dateAfter(dateAfter, dateRef, errors) {
    var err
    const dAfter = DateUtils.parseNatural(dateAfter)
    const dRef   = DateUtils.parseNatural(dateRef)
    if (dAfter && dRef && !(dAfter > dRef)) {
      err = getErr('deadline-before-start', [dateAfter, dateRef])
    }
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
