import { useSearch } from "wouter"

export function useSearchQuery() {
  const query = useSearch()
  const params = new URLSearchParams(query)

  const getParam = (str: string) => params.get(str)
  const isThereParam = (str: string) => getParam(str) != null && getParam(str) !== undefined

  return [getParam, isThereParam]
}
