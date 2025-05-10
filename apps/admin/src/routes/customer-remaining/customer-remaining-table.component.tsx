import { SelectOneTable } from "@/components"
import { cellRenderers } from "@/helpers"
import { useListen } from "@/hooks"
import type { PortfolioDto } from "emex-shared/gen-types"
import { apiClient } from "emex-shared/services/api-client"
import type { ComponentProps } from "react"

const columnDefs: ComponentProps<typeof SelectOneTable>["columnDefs"] = [
  { field: "stockName" as never, headerName: "نام محصول", checkboxSelection: true },
  {
    field: "volume" as never,
    headerName: "مقدار محصول",
    cellRenderer: cellRenderers.DebtRepresentor,
  },
]

export function CustomerRemainingTable({ signaler, selectedCustomerID, setSelection, setStock }) {
  // getUserPortfolio: id => new Endpoint(, "GET"),
  const res = apiClient.useFetch<PortfolioDto[]>(() => ({
    endpoint: `/Master/UserPortfolio/${selectedCustomerID}`,
  }))

  useListen(signaler, "reload data", res.reload)

  function selectionHandler(id: number) {
    setSelection(id)
    const stockID = res.data?.find(item => item.tyStockID === id).tyStockID
    setStock(stockID)
  }

  return (
    <SelectOneTable
      rowSelection={{ mode: "singleRow", enableClickSelection: true }}
      setSelection={selectionHandler}
      selectionKey="tyStockID"
      className="h-[40rem]"
      columnDefs={columnDefs}
      rowData={res.data}
    />
  )
}
