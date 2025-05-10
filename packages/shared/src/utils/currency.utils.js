import { englifyNumber, persianifyNumber, reverseString } from "."

/**
 * Generates rial string from price
 * @param {number | string} price
 * @param {number | boolean} decimalLimit will round the result
 * @returns {string} persianized, including commas
 */
function priceToRial(price, decimalLimit = false) {
  let final = String(price ?? 0)
  final = persianifyNumber(final)
  final = addCommaToPrice(final, decimalLimit)
  return final
}

/**
 * Generates price from rial strings
 * @param {string} rial
 * @returns {number}
 */
function rialToPrice(rial) {
  let final = rial
  final = englifyNumber(final)
  final = final.replace(/\D/gi, "")
  return Number(final)
}

/**
 * Generate meaningful toman price text form price
 * @param {string|number} price
 * @returns {string}
 */
function priceToToman(price) {
  let _price = price
  _price = Number(_price)
  _price = Math.round(_price / 10)
  _price = persianifyNumber(_price)
  _price = addCommaToPrice(_price)

  return _price
}

function addCommaCore(basePrice) {
  const splittedPrice = reverseString(basePrice)
    .split(/(.{3})/)
    .filter(x => x)
  const result = splittedPrice
    .map(reverseString)
    .reverse()
    .map((part, i) => (i === splittedPrice.length - 1 ? part : `${part},`))
    .join("")
  return result
}

/**
 * Adds commas to prices...
 * @todo write tests...
 * @param {string} price
 * @returns {string}
 */
function addCommaToPrice(price, decimalsLimit = false) {
  const _price = price.toString()
  // if the number has been splitted into 2 parts it means that it has decimals
  const hasDecimals = _price.split("/").length > 1
  const base = hasDecimals ? _price.split("/").at(0) : _price

  // if there's no decimal OR there's decimalLimit OR it's 0 return the base (without decimals)
  if (!hasDecimals || decimalsLimit === true || decimalsLimit === 0) return addCommaCore(base)

  const decimals = (() => {
    let _decimals = _price.split("/").at(-1)
    // if there's a limit, round decimals
    if (decimalsLimit) _decimals = _decimals.slice(0, decimalsLimit)
    return _decimals
  })()

  return `${addCommaCore(base)}/${decimals}`
}

export { priceToRial, rialToPrice, priceToToman, addCommaToPrice }
