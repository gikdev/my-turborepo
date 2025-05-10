import { Btn, Filter, TableFa } from "@/components"
import { formatters } from "@/helpers"
import { useDateFilter } from "@/hooks"
import { toISOStr } from "@/utils"
import { ArrowCounterClockwise, Check, X } from "@phosphor-icons/react"
import type { PageDto, TransferDto } from "vgold-shared/gen-types"
import { apiClient } from "vgold-shared/services/api-client"
import type { ComponentProps } from "react"
import * as transfersServices from "./transfers.services.js"

export function TransfersTable() {
  const COLUMN_DEFINITIONS: ComponentProps<typeof TableFa>["columnDefs"] = [
    { headerName: "مدیریت", cellRenderer: ManagementBtns, minWidth: 200 },
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
    { field: "stockName" as never, headerName: "نام محصول" },
    {
      field: "tyStockID" as never,
      headerName: "آیدی محصول",
      valueFormatter: formatters.persianNumber,
    },
    { field: "volume" as never, headerName: "حجم", valueFormatter: formatters.persianNumber },
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
  const dateFilterState = useDateFilter()
  const dataToSend = JSON.stringify({
    start: toISOStr(dateFilterState.fromDate),
    end: toISOStr(dateFilterState.toDate),
    countPerPage: 1000,
    pageNumber: 1,
  } satisfies PageDto)
  const res = apiClient.useFetch<TransferDto[]>(() => ({
    endpoint: "/Master/GetTransfer",
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

    function handleAcceptanceOrRejection(isAccepted) {
      const isConfirmed = confirm(`مطمئنی میخوای اینو ${isAccepted ? "تایید" : "رد"} کنی؟`)
      if (!isConfirmed) return

      transfersServices.accjectTransfer(id, isAccepted, () => res.reload())
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
