/**
 * Returns a randomly generated string
 * @param {Number} length num of chars you want the string to have
 * @returns {String} your random string
 */
function randomString(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const charsLenght = chars.length
  let result = ""
  for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * charsLenght))
  return result
}

/**
 * Reverses the string
 * @param {string} input
 * @returns {string}
 */
function reverseString(input) {
  return input.toString().split("").reverse().join("")
}

export { reverseString, randomString }
