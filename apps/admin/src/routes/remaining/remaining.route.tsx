import { Btn, TableFa } from "@/components"
import { cellRenderers } from "@/helpers"
import { useInEveryPage } from "@/hooks"
import { HeadingLine } from "@/layouts"
import { ArrowCounterClockwise } from "@phosphor-icons/react"
import type { MasterPortfolioDto } from "vgold-shared/gen-types"
import { apiClient } from "vgold-shared/services/api-client"
import type { ComponentProps } from "react"

const COLUMN_DEFINITIONS: ComponentProps<typeof TableFa>["columnDefs"] = [
  { field: "stockName" as never, headerName: "نام محصول" },
  {
    field: "volume" as never,
    headerName: "مقدار محصول",
    cellRenderer: cellRenderers.DebtRepresentor,
  },
]

function RemainingTable() {
  const res = apiClient.useFetch<MasterPortfolioDto[]>(() => ({
    endpoint: "/Master/GetMasterPortfolio",
  }))

  return (
    <>
      <Btn className="mb-4 mx-auto" onClick={() => res.reload()} icon={ArrowCounterClockwise}>
        تازه سازی
      </Btn>
      <TableFa className="h-[40rem]" rowData={res.data} columnDefs={COLUMN_DEFINITIONS} />
    </>
  )
}

export function Remaining() {
  useInEveryPage()

  return (
    <HeadingLine title="مانده حساب">
      <RemainingTable />
    </HeadingLine>
  )
}
