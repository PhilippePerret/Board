/**
 * DateUtils/DateUtils.js
 * v1.0.0
 * Méthodes utiles pour les Date
 */

const REG_HOUR = /([0-9]{1,2}) ?(?:(?::|heure|hour|hr|h)s?) ?([0-9]{2})(?:\:([0-9]{2}))?/

// "2026-07-29T09:00:00Z"
const REG_ISO_8601= /([0-9]{4})\-([0-9]{2})\-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(?:\.[0-9]+)?(Z|[+-][0-9]{2}:[0-9]{2})?$/

class DateUtils {

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
    dateRef > dateAfter
  }

  /**
   * @api
   * 
   * @return true si +dateRef+ est après +dateBefore+
   */
  static isBefore(dateRef, dateBefore){
    dateRef > dateBefore
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
        raise("DateUtils::extractHourFrom requiert une date string")
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
    return {hour: h, minute: m}
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
}