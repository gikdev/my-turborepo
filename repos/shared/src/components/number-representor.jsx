export function NumberRepresentor({ number, enableAbsoluteMode }) {
  const finalNumber = enableAbsoluteMode ? Math.abs(Number(number)) : Number(number)

  return <span dir="ltr">{finalNumber.toLocaleString()}</span>
}
