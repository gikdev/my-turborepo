import { useCallback, useMemo, useState } from "react"

function wrapSetter(setter, isFrom) {
  return value => {
    value.setHours(isFrom ? 0 : 23)
    value.setMinutes(isFrom ? 0 : 59)
    value.setSeconds(isFrom ? 0 : 59)
    setter(value)
  }
}

const initialFromDate = new Date()
initialFromDate.setHours(0)
initialFromDate.setMinutes(0)
initialFromDate.setSeconds(0)

const initialToDate = new Date()
initialToDate.setHours(23)
initialToDate.setMinutes(59)
initialToDate.setSeconds(59)

export function useDateFilter() {
  const [fromDate, setFromDate] = useState(initialFromDate)
  const [toDate, setToDate] = useState(initialToDate)
  const wrappedSetFromDate = useCallback(wrapSetter(setFromDate, true), [])
  const wrappedSetToDate = useCallback(wrapSetter(setToDate, false))

  const returnValue = useMemo(
    () => ({
      fromDate,
      setFromDate: wrappedSetFromDate,
      toDate,
      setToDate: wrappedSetToDate,
    }),
    [fromDate, toDate, wrappedSetFromDate, wrappedSetToDate],
  )

  return returnValue
}
