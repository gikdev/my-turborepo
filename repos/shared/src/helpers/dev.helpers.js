function transparentLog(anything) {
  console.log(anything)
  return anything
}

function assert(sth) {
  return {
    toBe(sth2) {
      // biome-ignore lint/suspicious/noDoubleEquals: <explanation>
      if (sth == sth2) return sth
      throw Error(`${sth} is ${sth} not the expected ${sth2}`)
    },
    toBeExactly(sth2) {
      if (sth === sth2) return sth
      throw Error(`${sth} is ${sth} not the expected ${sth2}`)
    },
    toBeOneOf(...sth2) {
      if (sth2.flat().includes(sth)) return sth
      throw Error(`${sth} is not one of ${sth2.join(" or ")}`)
    },
  }
}

export { assert, transparentLog }
