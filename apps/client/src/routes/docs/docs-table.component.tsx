import { Filter, TableFa } from "@/components"
import { cellRenderers, formatters } from "@/helpers"
import { useDateFilter } from "@/hooks"
import { TitledCard } from "@/layouts"
import { toISOStr } from "@/utils"
import { apiClient } from "vgold-shared/services/api-client"
import { type ComponentProps, useEffect, useState } from "react"

const COLUMN_DEFINITIONS: ComponentProps<typeof TableFa>["columnDefs"] = [
  { field: "id" as never, headerName: "آیدی", valueFormatter: formatters.persianNumber },
  { field: "createDate" as never, headerName: "تاریخ ایجاد", valueFormatter: formatters.date },
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
  {
    field: "orderStatus" as never,
    headerName: "وضعیت سفارش",
    valueFormatter: formatters.orderStatus,
  },
  { field: "docID" as never, headerName: "سند", cellRenderer: cellRenderers.GUIDLink },
  { field: "title" as never, headerName: "نام" },
  {
    field: "tyOrderID" as never,
    headerName: "آیدی سفارش",
    valueFormatter: formatters.persianNumber,
  },
]
const COUNT_PER_PAGE = 1000

export function DocsTable({ signaler }) {
  const dateFilterState = useDateFilter()
  const dataToSend = JSON.stringify({
    start: toISOStr(dateFilterState.fromDate),
    end: toISOStr(dateFilterState.toDate),
    countPerPage: COUNT_PER_PAGE,
    pageNumber: 1,
  })
  const res = apiClient.useFetch<unknown[]>(() => ({
    endpoint: "/Customer/GetDocs",
    method: "POST",
    body: dataToSend,
  }))

  useEffect(() => {
    signaler.listen("refetch", () => setTimeout(() => res.reload(), 3000))
  }, [signaler, res.reload])

  return (
    <TitledCard title="اسناد">
      <Filter {...dateFilterState} mutate={() => res.reload()} />
      <TableFa className="h-[30rem]" rowData={res.data} columnDefs={COLUMN_DEFINITIONS} />
    </TitledCard>
  )
}
