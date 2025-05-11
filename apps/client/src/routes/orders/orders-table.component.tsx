import { Filter, TableFa } from "@/components"
import { cellRenderers, formatters } from "@/helpers"
import { useDateFilter } from "@/hooks"
import { toISOStr } from "@/utils"
import type { ComponentProps } from "react"
import { apiClient } from "vgold-shared/services/api-client"

const COLUMN_DEFINITIONS: ComponentProps<typeof TableFa>["columnDefs"] = [
  { field: "id" as never, headerName: "آیدی", valueFormatter: formatters.persianNumber },
  { field: "time" as never, headerName: "آخرین به روز رسانی", valueFormatter: formatters.date },
  { field: "time" as never, headerName: "زمان", valueFormatter: formatters.timeHHmmss },
  {
    field: "tyStockID" as never,
    headerName: "آیدی محصول",
    valueFormatter: formatters.persianNumber,
  },
  { field: "stockName" as never, headerName: "نام محصول" },
  {
    field: "orderStatus" as never,
    headerName: "وضعیت سفارش",
    valueFormatter: formatters.orderStatus,
  },
  { field: "side" as never, headerName: "نوع سفارش", valueFormatter: formatters.orderSide },
  { field: "price" as never, headerName: "قیمت", valueFormatter: formatters.rial },
  {
    field: "volume" as never,
    headerName: "مقدار",
    cellRenderer: cellRenderers.AbsoluteLocaleNumberCell,
  },
  {
    field: "value" as never,
    headerName: "ارزش معامله (ریال)",
    cellRenderer: cellRenderers.AbsoluteLocaleNumberCell,
  },
]
const COUNT_PER_PAGE = 1000

export function OrdersTable() {
  const dateFilterState = useDateFilter()
  const dataToSend = JSON.stringify({
    start: toISOStr(dateFilterState.fromDate),
    end: toISOStr(dateFilterState.toDate),
    countPerPage: COUNT_PER_PAGE,
    pageNumber: 1,
  })
  const res = apiClient.useFetch<unknown[]>(() => ({
    endpoint: "/Customer/GetOrders",
    method: "POST",
    body: dataToSend,
  }))

  return (
    <>
      <Filter {...dateFilterState} mutate={res.reload} />
      <TableFa rowData={res.data} columnDefs={COLUMN_DEFINITIONS} />
    </>
  )
}
