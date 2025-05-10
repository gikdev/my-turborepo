import { useCallback, useEffect, useRef, useState } from "react"

function useTNTTimer(time, onEnd) {
  const [remaining, setRemaining] = useState(time)
  const isGoing = useRef(false)
  const timerInterval = useRef(null)
  const endTime = new Date()

  useEffect(() => {
    if (remaining > 0) return
    isGoing.current = false
    onEnd()
  }, [onEnd, remaining])

  useEffect(() => {
    endTime.setSeconds(endTime.getSeconds() + time)
    timerInterval.current = setInterval(() => {
      if (remaining <= 0) return
      if (isGoing.current === true) setRemaining(prev => prev - 1)
    }, 1000)
    return () => clearInterval(timerInterval.current)
  }, [endTime, time, remaining])

  const start = useCallback(() => {
    isGoing.current = true
  }, [])

  const reset = useCallback(() => {
    isGoing.current = false
    setRemaining(time)
  }, [time])

  return { remaining, start, reset }
}

export { useTNTTimer }
