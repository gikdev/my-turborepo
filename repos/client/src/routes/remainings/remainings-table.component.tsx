import { TableFa } from "@/components"
import { formatters } from "@/helpers"
import { apiClient } from "emex-shared/services/api-client"
import type { ComponentProps } from "react"

const COLUMN_DEFINITIONS: ComponentProps<typeof TableFa>["columnDefs"] = [
  { field: "stockName" as never, headerName: "نام محصول" },
  { field: "volume" as never, headerName: "مقدار محصول", valueFormatter: formatters.debt },
]

export function RemainingsTable() {
  const res = apiClient.useFetch<unknown[]>(() => ({
    endpoint: "/Customer/GetPortfoli",
  }))

  return <TableFa rowData={res.data} columnDefs={COLUMN_DEFINITIONS} />
}
