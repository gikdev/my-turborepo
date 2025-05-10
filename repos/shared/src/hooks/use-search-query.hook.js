import { useSearch } from "wouter"

function useSearchQuery() {
  const query = useSearch()
  const params = new URLSearchParams(query)

  const getParam = str => params.get(str)
  const isThereParam = str => getParam(str) != null && getParam(str) !== undefined

  return [getParam, isThereParam]
}

export { useSearchQuery }
