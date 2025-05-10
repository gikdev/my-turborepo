/** A handy tool to yell at the user... 😁
 * @param {boolean} condition
 * @param {string} message
 */
function throwErrorIf(condition, message) {
  if (condition) throw new Error(message)
}

class Signal {
  constructor(name, action) {
    this.name = name
    this.action = action
  }
}

class Signaler {
  constructor() {
    this.signals = new Set()
  }
  listen(name, action) {
    throwErrorIf(!name, "`name` not specified. What do you want me to listen to?")
    throwErrorIf(!action, "`action` not specified. What do you want me to when ran?")
    this.signals.add(new Signal(name, action))
  }
  add(signal) {
    throwErrorIf(!signal, "`signal` not specified")
    this.signals.add(signal)
  }
  run(signalName, ...other) {
    throwErrorIf(!signalName, "The `signalName` is a fulsy value. Should be a `string`")
    const filteredSingals = Array.from(this.signals).filter(signal => signal.name === signalName)
    throwErrorIf(
      !filteredSingals.length,
      `The \`signalName\` specified (${signalName}) is not registered`,
    )
    for (const signal of filteredSingals) signal.action(...other)
  }
  runAll(...names) {
    const filteredSingals = Array.from(this.signals).filter(signal => names.includes(signal.name))
    for (const signal of filteredSingals) signal.action()
  }
  isThere(name) {
    return Array.from(this.signals).findIndex(signal => signal.name === name) !== -1
  }
}

export { Signal, Signaler }
