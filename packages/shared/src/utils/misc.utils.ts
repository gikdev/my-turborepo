export function deleteAllCookies() {
  for (const cookie of document.cookie.split(";")) {
    const eqPos = cookie.indexOf("=")
    const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }
}
