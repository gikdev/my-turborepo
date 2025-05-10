import { Btn, Filter, TableFa } from "@/components"
import { cellRenderers, formatters } from "@/helpers"
import { useDateFilter } from "@/hooks"
import { toISOStr } from "@/utils"
import { ArrowCounterClockwise, Check, X } from "@phosphor-icons/react"
import type { DocumentDto } from "vgold-shared/gen-types"
import { apiClient } from "vgold-shared/services/api-client"
import type { ComponentProps } from "react"
import * as docsServices from "./docs.services.js"

export function DocsTable() {
  const COLUMN_DEFINITIONS: ComponentProps<typeof TableFa>["columnDefs"] = [
    { headerName: "مدیریت", cellRenderer: ManagementBtns, minWidth: 200 },
    {
      field: "tyOrderID" as never,
      headerName: "آیدی سفارش",
      valueFormatter: formatters.persianNumber,
    },
    { field: "title" as never, headerName: "عنوان" },
    { field: "docId" as never, headerName: "سند", cellRenderer: cellRenderers.GUIDLink },
    {
      field: "orderStatus" as never,
      headerName: "وضعیت محصول",
      valueFormatter: formatters.orderStatus,
    },
    {
      field: "confirmerID" as never,
      headerName: "آیدی تایید کننده",
      valueFormatter: formatters.persianNumber,
    },
    { field: "confirmer" as never, headerName: "تایید کننده" },
    {
      field: "senderID" as never,
      headerName: "آیدی فرستنده",
      valueFormatter: formatters.persianNumber,
    },
    { field: "sender" as never, headerName: "فرستنده" },
    { field: "createDate" as never, headerName: "تاریخ ایجاد", valueFormatter: formatters.date },
    { field: "id" as never, headerName: "آیدی", valueFormatter: formatters.persianNumber },
  ]
  const dateFilterState = useDateFilter()
  const dataToSend = JSON.stringify({
    start: toISOStr(dateFilterState.fromDate),
    end: toISOStr(dateFilterState.toDate),
    countPerPage: 1000,
    pageNumber: 1,
  })
  const res = apiClient.useFetch<DocumentDto[]>(() => ({
    endpoint: "/Master/GetDocs",
    method: "POST",
    body: dataToSend,
  }))

  return (
    <>
      <Btn className="mb-4 mx-auto" onClick={() => res.reload()} icon={ArrowCounterClockwise}>
        تازه سازی
      </Btn>
      <Filter {...dateFilterState} mutate={res.reload} />
      <TableFa className="h-[40rem]" rowData={res.data} columnDefs={COLUMN_DEFINITIONS} />
    </>
  )

  function ManagementBtns({ data }) {
    const { id, orderStatus } = data

    function handleAcceptanceOrRejection(isAccepted: boolean) {
      const isConfirmed = confirm(`مطمئنی میخوای اینو ${isAccepted ? "تایید" : "رد"} کنی؟`)
      if (!isConfirmed) return

      docsServices.accjectDoc(id, isAccepted, () => res.reload())
    }
    const handleAcceptBtnClick = () => handleAcceptanceOrRejection(true)
    const handleRejectBtnClick = () => handleAcceptanceOrRejection(false)

    return (
      <div className="flex gap-2">
        <Btn
          disabled={[3, 4].includes(orderStatus)}
          icon={Check}
          onClick={handleAcceptBtnClick}
          theme="success"
          themeType="filled"
        >
          تایید
        </Btn>
        <Btn
          disabled={[3, 4].includes(orderStatus)}
          icon={X}
          onClick={handleRejectBtnClick}
          theme="error"
        >
          رد
        </Btn>
      </div>
    )
  }
}
