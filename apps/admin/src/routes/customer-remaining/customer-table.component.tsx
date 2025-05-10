import { SelectOneTable } from "@/components"
import { formatters } from "@/helpers"
import type { CustomerDto } from "@repo/shared/gen-types"
import { apiClient } from "@repo/shared/services/api-client"
import type { ComponentProps } from "react"

type AnObjectThatHasIsActiveProp = { isActive: boolean }
type SelectOneTableProps = ComponentProps<typeof SelectOneTable>

const columnDefs: SelectOneTableProps["columnDefs"] = [
  {
    field: "id" as never,
    headerName: "آیدی",
    valueFormatter: formatters.persianNumber,
    checkboxSelection: p => Boolean((p.data as AnObjectThatHasIsActiveProp).isActive as boolean),
    showDisabledCheckboxes: true,
  },
  { field: "isActive" as never, headerName: "فعال هست؟" },
  { field: "displayName" as never, headerName: "نام" },
  { field: "mobile" as never, headerName: "موبایل", valueFormatter: formatters.persianNumber },
]
const rowSelection: SelectOneTableProps["rowSelection"] = {
  mode: "singleRow",
  isRowSelectable: rowNode => Boolean((rowNode.data as AnObjectThatHasIsActiveProp).isActive),
  enableClickSelection: true,
}

interface CustomerTableProps {
  setSelection: (id: number) => void
  setMobile: (mobile: string) => void
}

export function CustomerTable({ setSelection, setMobile }: CustomerTableProps) {
  const res = apiClient.useFetch<CustomerDto[]>(() => ({
    endpoint: "/Master/GetCustomers",
  }))

  function selectionHandler(id: number) {
    setSelection(id)
    const mobile = res.data?.find(customer => customer.id === id).mobile
    setMobile(mobile)
  }

  return (
    <SelectOneTable
      rowSelection={rowSelection}
      selectionKey="id"
      columnDefs={columnDefs}
      setSelection={selectionHandler}
      className="h-[40rem]"
      rowData={res.data}
    />
  )
}
