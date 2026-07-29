/**
 * DateUtils/Date.js
 * v1.0.0
 * Méthodes utiles pour les Date
 */
class DateUtils {

  /** 
   * @api
   * 
   *  @get    "10:30"/"10 h 30"/"10h30"/"10 heures 30"/ 
   *  @return La date à cette heure là pour aujourd'hui
  */
  static dateFromHour(hourStr) {
    const heure = this._parseHour(hourStr)
    if (heure === null) return null
    var d = new DateUtils()
    return new Date(d.year, d.month, d.day, heure.hour, heure.minute, 0)
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





  static _parseHour(str){
    var found = str.match(/([0-9{1,2}):([0-9]{1,2})/)
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
}