import { apiClient } from "vgold-shared/services/api-client"

type ResultKeyValues = string | number | null | undefined

export function useGetMasterInfo(input: string[]): ResultKeyValues[] {
  const res = apiClient.useFetch<{ result: Record<string, ResultKeyValues> }>(() => ({
    endpoint: "/Customer/GetMaster",
    method: "GET",
  }))

  if (!res.status.isSuccess) return []

  const toReturn: ResultKeyValues[] = []

  input.map(key => toReturn.push(res.data.result[key]))

  return toReturn
}
