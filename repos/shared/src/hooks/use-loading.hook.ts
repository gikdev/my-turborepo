import { useCallback, useState } from "react"

export function useLoading(initialValue = false) {
  const [isLoading, setIsLoading] = useState(initialValue)

  const startLoading = useCallback(() => setIsLoading(true), [])

  const endLoading = useCallback(() => setIsLoading(false), [])

  return [isLoading, startLoading, endLoading, setIsLoading] as const
}
