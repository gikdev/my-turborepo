import { useEffect, useRef } from "react"
import { DatePicker } from "zaman"
import type { onRangeDatePickerChangePayload } from "zaman/dist/types"

interface FilterProps {
  fromDate: Date
  toDate: Date
  setFromDate: (input: Date) => void
  setToDate: (input: Date) => void
  mutate: () => void
}

export function Filter({ fromDate, toDate, setFromDate, setToDate, mutate }: FilterProps) {
  const prevFrom = useRef<number>(fromDate.getTime())
  const prevTo = useRef<number>(toDate.getTime())

  function handleFiltering(e: onRangeDatePickerChangePayload) {
    const nextFrom = new Date(e.from)
    const nextTo = new Date(e.to)

    // Only update if dates are different
    if (nextFrom.getTime() !== fromDate.getTime() || nextTo.getTime() !== toDate.getTime()) {
      setFromDate(nextFrom)
      setToDate(nextTo)
    }
  }

  useEffect(() => {
    const currentFrom = fromDate.getTime()
    const currentTo = toDate.getTime()

    const changed = currentFrom !== prevFrom.current || currentTo !== prevTo.current

    if (!changed) return

    prevFrom.current = currentFrom
    prevTo.current = currentTo

    mutate()
  }, [fromDate, toDate, mutate])

  return (
    <div className="flex items-center gap-2 flex-col sm:flex-row mb-3">
      <p className="w-max shrink-0">فیلتر بر اساس تاریخ:</p>
      <DatePicker
        from={fromDate}
        to={toDate}
        className="z-10"
        onChange={handleFiltering}
        range
        inputClass="
          w-full grow shrink text-center px-4 py-3
          bg-slatedark-3 border border-slatedark-6
          rounded text-slatedark-11 w-full
          focus:border-transparent focus:bg-slatedark-5 
          focus:text-slatedark-12
        "
      />
    </div>
  )
}
