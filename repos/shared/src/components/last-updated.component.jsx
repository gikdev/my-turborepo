import { PersianDate, getTimeFa } from "../utils"

function LastUpdated({ dateStr, classes = "" }) {
  const time = new PersianDate(dateStr)
  const timeFa = getTimeFa(time)

  return (
    <span className={`text-opacity-75 ${classes}`}>
      <span>{time.toLocaleDateString()}</span>
      <span>-</span>
      <span>{timeFa}</span>
    </span>
  )
}

export { LastUpdated }
