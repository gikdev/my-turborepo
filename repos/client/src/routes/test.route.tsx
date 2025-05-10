import { AG_GRID_LOCALE_IR } from "@/constants"
import { persianifyNumber, priceToToman } from "@/utils"
import { AgGridReact } from "ag-grid-react"
import type { ComponentProps } from "react"

const SAMPLE_DATA = [
  { id: 0, name: "احمد", date: new Date(0), income: 589_000_000 },
  { id: 1, name: "محمد", date: new Date(0), income: 320_000_000 },
  { id: 2, name: "علی", date: new Date(0), income: 128_000_000 },
  { id: 3, name: "احمد", date: new Date(0), income: 589_000_000 },
  { id: 4, name: "محمد", date: new Date(0), income: 320_000_000 },
  { id: 5, name: "علی", date: new Date(0), income: 128_000_000 },
  { id: 6, name: "احمد", date: new Date(0), income: 589_000_000 },
  { id: 7, name: "محمد", date: new Date(0), income: 320_000_000 },
  { id: 8, name: "علی", date: new Date(0), income: 128_000_000 },
  { id: 9, name: "احمد", date: new Date(0), income: 589_000_000 },
  { id: 10, name: "احمد", date: new Date(0), income: 589_000_000 },
  { id: 11, name: "محمد", date: new Date(0), income: 320_000_000 },
  { id: 12, name: "علی", date: new Date(0), income: 128_000_000 },
  { id: 13, name: "احمد", date: new Date(0), income: 589_000_000 },
  { id: 14, name: "محمد", date: new Date(0), income: 320_000_000 },
  { id: 15, name: "علی", date: new Date(0), income: 128_000_000 },
  { id: 16, name: "احمد", date: new Date(0), income: 589_000_000 },
  { id: 17, name: "محمد", date: new Date(0), income: 320_000_000 },
  { id: 18, name: "علی", date: new Date(0), income: 128_000_000 },
  { id: 19, name: "احمد", date: new Date(0), income: 589_000_000 },
]

const formatters = {
  id: p => persianifyNumber(p.value),
  income: p => `${priceToToman(p.value)} تومن`,
}

const COL_DEF: ComponentProps<typeof AgGridReact>["columnDefs"] = [
  {
    field: "id" as never,
    headerName: "آیدی",
    valueFormatter: formatters.id,
    checkboxSelection: true,
  },
  { field: "name" as never, headerName: "نام" },
  { field: "date" as never, headerName: "تاریخ" },
  { field: "income" as never, headerName: "درآمد", valueFormatter: formatters.income },
]

export function Test() {
  return (
    <div className="h-full ag-theme-quartz-dark">
      <AgGridReact
        localeText={AG_GRID_LOCALE_IR}
        rowData={SAMPLE_DATA}
        columnDefs={COL_DEF}
        pagination
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20]}
        enableRtl
        rowSelection="multiple"
        defaultColDef={{ minWidth: 200, filter: true, floatingFilter: true, lockPosition: true }}
      />
    </div>
  )
}
