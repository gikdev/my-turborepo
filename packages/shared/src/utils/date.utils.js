import { persianifyNumber } from "."

/**
 * Gives you...
 * @todo Write JSDoc
 * @param {string|Date} input
 * @returns {string}
 */
function toISOStr(input) {
  let date

  if (typeof input === "string") date = new Date(input)
  else date = input

  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  const h = String(date.getHours()).padStart(2, "0")
  const mn = String(date.getMinutes()).padStart(2, "0")
  const s = String(date.getSeconds()).padStart(2, "0")
  const ms = String(date.getMilliseconds()).padStart(3, "0")

  return `${y}-${m}-${d}T${h}:${mn}:${s}.${ms}`
}

/**
 * It's a Persian-compatible version of `Date`
 * @class PersianDate
 * @typedef {PersianDate}
 * @extends {Date}
 */
class PersianDate extends Date {
  toLocaleDateString = () => super.toLocaleDateString("fa-IR")
  getParts = () => super.toLocaleDateString().split("/")
  getDay = () => (super.getDay() === 6 ? 0 : super.getDay() + 1)
  getDate = () => this.getParts()[2]
  getMonth = () => this.getParts()[1] - 1
  getYear = () => this.getParts()[0]
  getMonthName = () => super.toLocaleDateString("fa-IR", { month: "long" })
  getDayName = () => super.toLocaleDateString("fa-IR", { weekday: "long" })
}

/**
 * Returns time in FA
 * @param {Date | string | null | undefined} input - Give a date obj, str to get that specific time or pass null / nothing to get current time...
 * @returns {string} - the time in FA
 */
function getTimeFa(input) {
  const now = new Date(input)
  const h = now.getHours()
  const m = now.getMinutes()
  const s = now.getSeconds()
  const time = `${persianifyNumber(h > 9 ? h : `0${h}`)}:${persianifyNumber(m > 9 ? m : `0${m}`)}:${persianifyNumber(s > 9 ? s : `0${s}`)}`
  return time
}

export { PersianDate, getTimeFa, toISOStr }
