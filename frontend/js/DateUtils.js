/**
 * DateUtils/DateUtils.js
 * v1.0.0
 * Méthodes utiles pour les Dates
 * 
 */

const REG_HOUR = /([0-9]{1,2}) ?(?:(?::|heure|hour|hr|h)s?) ?([0-9]{2})?(?:\:([0-9]{2}))?/

// "2026-07-29T09:00:00Z"
const REG_ISO_8601= /([0-9]{4})\-([0-9]{2})\-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(?:\.[0-9]+)?(Z|[+-][0-9]{2}:[0-9]{2})?$/

class DateUtils {

  static formate(dateRef, format) {
    format = format || getMsg('date/format')
    var date = dateRef instanceof Date ? dateRef : new Date(dateRef)
    const fyear = String(date.getFullYear())
    const mois = getMsg('date/months').split('|')
    return format
      .replace(/\%YY/, fyear[2] + fyear[3])
      .replace(/\%Y/, fyear)
      .replace(/\%_M/, mois[date.getMonth()])
      .replace(/\%M/,  String(date.getMonth() + 1).padStart(2, '0'))
      .replace(/\%JJ/, String(date.getDate()).padStart(2, '0'))
      .replace(/\%J/, date.getDate())
  }

  /**
   * @api
   * 
   * @return true si les dates sont assez proches (moins du temps en minutes
   * fourni en second argument)
   */
  static close(firstTime, lastTime, lapsMinutes) {
    var diff = this._diff(firstTime, lastTime)
    // console.log("closed = ", diff < lapsMinutes)
    return diff < lapsMinutes
  }

  /**
   * @api
   * 
   * @return true si +dateRef+ est avant +dateAfter+
   */
  static isAfter(dateRef, dateAfter){
    return dateRef > dateAfter
  }

  /**
   * @api
   *
   * @return true si +dateRef+ est après +dateBefore+
   */
  static isBefore(dateRef, dateBefore){
    return dateRef < dateBefore
  }

  /**
   * @api
   * 
   * Retourne la {Date} à partir d'un string ISO 8601 ("2026-07-29T09:00:00Z")
   * 
   * Note : pour bénéficier des helpers, ajouter true en second paramètre
   *        ce qui retournera une {DateUtils}
   */
  static parseAsIso8601(dateStr, asDateUtils = false){
    const found = dateStr.match(REG_ISO_8601)
    if (found === null) return null
    const [, sign, offH, offM] = String(found[7]).match(/([+-])([0-9]{2}):([0-9]{2})/) || [null, false, null, null]
    if (found === null) return null
    const [year, month, day, hour, min, sec] = found.slice(1,7).map(n => parseInt(n))
    var date
    if (found[7] == 'Z') {
      const timestamp = Date.UTC(year, month-1, day, hour, min, sec)
      date = new Date(timestamp)
    } else if (sign) {
      const timestamp = Date.UTC(year, month-1, day, hour, min, sec) - (sign == '-' ? -1 : 1) * (offH*60+Number(offM)) * 60000
      date = new Date(timestamp)
    } else {
      date = new Date(year, month - 1, day, hour, min, sec)
    }
    return asDateUtils ? new DateUtils(date) : date
  }

  /**
   * @api
   * 
   * Retourne la date d'aujourd'hui à l'heure définie par
   * +objTime+ qui peut-être soit "10:50" et ses variantes ou
   * un objet {hour, minute}
   * @param time  SOIT {String} h:mm et ses dérivés
   *              SOIT {Object} {hour, minute, second}
   * 
   * @return La {Date} d'aujourd'hui correspondant à l'heure
   */
  static todayWithTime(time){
    if ('string' == typeof time) {
      return this.todayFromHour(time)
    }
    var d = new DateUtils()
    return new Date(d.year, d.month, d.day, time.hour, time.minute, time.second || 0)
  }


  /** 
   * @api
   * 
   *  @get    "10:30"/"10 h 30"/"10h30"/"10 heures 30"/ 
   *  @return La date à cette heure là pour aujourd'hui
  */
  static todayFromHour(hourStr) {
    const heure = this._parseHour(hourStr)
    if (heure === null) return null
    return this.todayWithTime({hour: heure.hour, minute: heure.minute})
  }

  /**
   * @api
   * 
   * Extrait l'heure d'une date string (qui doit se trouver après 'à/at') (ou iso 8601)
   */
  static extractHourFrom(dateStr){
    var date, hour
    try {
      if ('string' == typeof dateStr) {
        if ( date = this.parseAsIso8601(dateStr)) {
          date = new DateUtils(date)
          return { hour: date.hour, minute: date.minute }
        } else if ( this.hasHour(dateStr) ) {
          [date, hour] = dateStr.split(getMsg('date/at'))
          return this._parseHour(hour.trim()) // {hour, minute}
        } else {
          // La date ne définit pas d'heure
          return null
        }
      } else {
        raise('[SYSTEM] DateUtils::extractHourFrom requiert une date string')
      }
    } catch(err) {
      console.error("Problème avec '%s' / date: '%s' / hour: '%s'", dateStr, date, hour,  err)
      return {hour: 0, minute: 0}
    }
  }

  /**
   * @api
   * Pour obtenir la "date dans…" 3 minutes, 3 jours, etc.
   * 
   * @param amount  {Integer} La quantité de unit
   * @param unit    {String} 'second', 'minute', 'hour', 'day', 'week', 'month', 'year'
   */
  static dateIn(amount, unit){
    var d = new DateUtils()
    return d.add(amount, unit)
  }

  /**
   * @api
   * 
   * Fonction retournant true si la date, exprimée en string,
   * possède une heure (donc le texte 'at', 'à' en fonction de la langue)
   */
  static hasHour(date){
    if (this.parseAsIso8601(date) !== null ) {
      return true
    } else {
      return date.match(` ${getMsg('date/at')} `) !== null
    }
  }

  /**
   * @api
   * 
   * Retourne une date de la fin du jour +day+ ou aujourd'hui
   */
  static endOfDay(day){
    day = day ?? new Date()
    day.setHours(23)
    day.setMinutes(59)
    day.setSeconds(59)
    return day
  }



  // @return La différence en minutes entre +date1+ et +date2+
  static _diff(date1, date2) {
    var diff = Math.abs(date1.getTime() - date2.getTime())
    diff = Math.round(diff / 1000) // => seconds
    return diff / 60 // 
  }

  static _parseHour(str){
    var found = str.match(REG_HOUR)
    if (found === null) return null
    var [tout, h, m] = found
    return {hour: parseInt(h, 10), minute: m === undefined ? 0 : parseInt(m, 10)}
  }

  constructor(date){
    this.date = date ?? new Date()
  }

  add(amount, unit){
    var year    = 0 + this.year
    var month   = 0 + this.month
    var day     = 0 + this.day
    var hour    = 0 + this.hour
    var minute  = 0 + this.minute
    var second  = 0 + this.second
    switch(unit){
      case 'year':    year    = year + amount; break
      case 'month':   month   = month + amount; break
      case 'hour':    hour    = hour + amount; break
      case 'day':     day     = day + amount; break
      case 'week':    day     = day + 7 * amount; break
      case 'minute':  minute  = minute + amount; break
      case 'second':  second  = second + amount; break
    }
    return new Date(year, month, day, hour, minute, second)
  }

  get year(){ return this.date.getFullYear()}
  get month(){ return this.date.getMonth()}
  get day(){ return this.date.getDate()}
  get hour(){return this.date.getHours()}
  get minute(){return this.date.getMinutes()}
  get second(){return this.date.getSeconds()}

  isAfter(date) {
    if (date instanceof DateUtils) date = date.date
    return this.date > date
  }

  /**
   * @api
   *
   * Transforme une date-string acceptée par Validator.date() (ISO 8601,
   * JJ/MM/AAAA et dérivés, mot-clé relatif localisé, ou "dans X unité"
   * localisé) en vraie {Date}.
   *
   * @return La {Date} correspondante, ou null si le format n'est pas reconnu.
   */
  static parseNatural(str){
    if (!str) return null
    const L = this._naturalLocaleData()
    var found
    if ( found = this.parseAsIso8601(str) ) return found

    if ( found = str.match(L.numericDateReg) ) {
      const day   = parseInt(found[1], 10)
      const month = parseInt(found[2], 10) - 1
      const year  = found[3] ? (found[3].length == 2 ? 2000 + parseInt(found[3], 10) : parseInt(found[3], 10)) : new Date().getFullYear()
      const d = new Date(year, month, day)
      if (found[4]) {
        const heure = this._parseHour(found[4])
        if (heure) { d.setHours(heure.hour); d.setMinutes(heure.minute) }
      }
      return d
    }

    for (const [word, offset] of L.relativeDayOffset) {
      if (word && str.match(new RegExp(`(${word})`))) {
        return this.dateIn(offset, 'day')
      }
    }

    if ( found = str.match(L.durationInReg) ) {
      const amount = parseInt(found[1], 10)
      const unitWord = found[2]
      const unitEntry = L.unitToCanon.find(([w]) => new RegExp(`^(${w})$`).test(unitWord))
      return this.dateIn(amount, unitEntry ? unitEntry[1] : 'day')
    }

    return null
  }

  // Calculé au premier appel seulement (pas au chargement du module :
  // DateUtils.js est chargé avant Messagerie.js/getMsg dans index.html).
  static _naturalLocaleData(){
    if (this.__naturalLocaleData) return this.__naturalLocaleData
    const unitToCanon = [
      [getMsg('regexp:unit-month'),  'month'],
      [getMsg('regexp:unit-week'),   'week'],
      [getMsg('regexp:unit-day'),    'day'],
      [getMsg('regexp:unit-hour'),   'hour'],
      [getMsg('regexp:unit-minute'), 'minute'],
    ]
    // Ordre important : les formes longues ("après-demain") contiennent
    // parfois les formes courtes ("demain") comme sous-chaîne — elles
    // doivent être testées en premier.
    const relativeDayOffset = [
      [getMsg('regexp:day-after-tomorrow'),  2],
      [getMsg('regexp:day-before-yesterday'), -2],
      [getMsg('regexp:tomorrow'),            1],
      [getMsg('regexp:yesterday'),          -1],
      [getMsg('regexp:today'),               0],
    ]
    const datePrefix = getMsg('regexp:date-prefix')
    const hourReg = `[0-9]{1,2} ?(?::|${getMsg('regexp:hour-words')})s? ?[0-9]{0,2}`
    const numericDateReg = new RegExp(`^(?:${datePrefix})?([0-9]{1,2})[ :\\-\\/]([0-9]{1,2})(?:[ :\\-\\/]([0-9]{2,4}))?(?: ${getMsg('date/at')} (${hourReg}))?$`)
    const durationInReg = new RegExp(getMsg('regexp:duration-in'))
    return this.__naturalLocaleData = { unitToCanon, relativeDayOffset, numericDateReg, durationInReg }
  }
}