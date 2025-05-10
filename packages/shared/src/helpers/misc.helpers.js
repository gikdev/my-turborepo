import clsx from "clsx"
import Cookies from "js-cookie"
import { twMerge } from "tailwind-merge"
import { swalert } from "."

/** Converts a number to a `step` string for `<input />`
 * @example decimalCountToInputStep(3) // "0.001"
 * @param {number} decimalCount >= 1
 * @returns
 */
function decimalCountToInputStep(decimalCount) {
  const _decimalCount = decimalCount >= 1 ? decimalCount : 1
  let final = ""
  final += "0."
  for (let i = 0; i < _decimalCount - 1; i++) final += "0"
  final += "1"
  return final
}

/**
 * Gets expiry for that react-timer
 * @param {number} seconds Amount of time in seconds
 * @returns {Date}
 */
function getExpiry(seconds) {
  const date = new Date()
  date.setSeconds(date.getSeconds() + seconds)
  return date
}

/**
 * Handles notifying user about updates and version...
 * @param {'CLIENT' | 'ADMIN'} app
 * @returns {void}
 */
function handleUpdate(version, app) {
  const keys = {
    version: "APP_VERSION",
    checked: "LAST_TIME_CHECKED",
    app: app,
  }
  const setCheckedNow = () => Cookies.set(keys.checked, JSON.stringify(Date.now()))
  const doesVersionExist = !!Cookies.get(keys.version)
  const doesCheckedExist = !!Cookies.get(keys.checked)
  const doesAppExist = !!Cookies.get(keys.version)

  if (!doesAppExist) Cookies.set(keys.app, app)

  if (!doesCheckedExist || !doesVersionExist) {
    Cookies.set(keys.version, version)
    setCheckedNow()

    return
  }

  const isUpdated = Cookies.get(keys.version) === version

  if (isUpdated) {
    setCheckedNow()
    return
  }

  if (!isUpdated) {
    Cookies.set(keys.version, version)
    setCheckedNow()
    swalert.updateApp()
  }
}

const cn = (...inputs) => twMerge(clsx(inputs))

export function showNotification(title, body) {
  if (!("Notification" in window)) {
    console.warn("Notifications not supported")
    alert(`${title}\n${body}`) // Fallback
    return
  }

  if (Notification.permission === "granted") {
    new Notification(title, { body })
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(title, { body })
      }
    })
  }
}

export { cn, decimalCountToInputStep, getExpiry, handleUpdate }
