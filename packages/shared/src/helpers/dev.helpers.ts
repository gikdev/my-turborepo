export function transparentLog<T>(anything: T): T {
  console.log(anything)
  return anything
}
