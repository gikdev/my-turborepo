import { Filter, TableFa } from "@/components"
import { formatters } from "@/helpers"
import { useDateFilter } from "@/hooks"
import { TitledCard } from "@/layouts"
import { toISOStr } from "@/utils"
import type { TransferDto } from "vgold-shared/gen-types"
import { apiClient } from "vgold-shared/services/api-client"
import { type ComponentProps, useEffect } from "react"

const COLUMN_DEFINITIONS: ComponentProps<typeof TableFa>["columnDefs"] = [
  { field: "id" as never, headerName: "آیدی", valueFormatter: formatters.persianNumber },
  { field: "createDate" as never, headerName: "تاریخ ساخت", valueFormatter: formatters.date },
  { field: "sender" as never, headerName: "فرستنده" },
  {
    field: "senderID" as never,
    headerName: "آیدی فرستنده",
    valueFormatter: formatters.persianNumber,
  },
  { field: "confirmer" as never, headerName: "تایید کننده" },
  {
    field: "confirmerID" as never,
    headerName: "آیدی تایید کننده",
    valueFormatter: formatters.persianNumber,
  },
  { field: "stockName" as never, headerName: "نام محصول" },
  {
    field: "tyStockID" as never,
    headerName: "آیدی محصول",
    valueFormatter: formatters.persianNumber,
  },
  { field: "volume" as never, headerName: "مقدار", valueFormatter: formatters.persianNumber },
  {
    field: "orderStatus" as never,
    headerName: "وضعیت سفارش",
    valueFormatter: formatters.orderStatus,
  },
  { field: "customer" as never, headerName: "مشتری" },
  {
    field: "tyCustomerID" as never,
    headerName: "آیدی مشتری",
    valueFormatter: formatters.persianNumber,
  },
  { field: "name" as never, headerName: "نام" },
  { field: "description" as never, headerName: "توضیح" },
  { field: "mobile" as never, headerName: "موبایل", valueFormatter: formatters.persianNumber },
]

export function TransfersTable({ signaler }) {
  const dateFilterState = useDateFilter()
  const dataToSend = JSON.stringify({
    start: toISOStr(dateFilterState.fromDate),
    end: toISOStr(dateFilterState.toDate),
    countPerPage: 1000,
    pageNumber: 1,
  })

  const res = apiClient.useFetch<TransferDto[]>(() => ({
    endpoint: "/Customer/GetTransfers",
    method: "POST",
    body: dataToSend,
  }))

  useEffect(() => {
    signaler.listen("refetch", () => setTimeout(res.reload, 3000))
  }, [signaler, res.reload])

  return (
    <TitledCard title="حواله‌ها">
      <Filter {...dateFilterState} mutate={res.reload} />
      <TableFa className="h-[30rem]" rowData={res.data} columnDefs={COLUMN_DEFINITIONS} />
    </TitledCard>
  )
}
