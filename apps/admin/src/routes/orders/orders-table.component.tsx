import { Btn, Filter, TableFa } from "@/components"
import { useSignalRContext } from "@/contexts/signalr.context"
import { cellRenderers, formatters } from "@/helpers"
import { useDateFilter } from "@/hooks"
import { toISOStr } from "@/utils"
import { ArrowCounterClockwise, Check, X } from "@phosphor-icons/react"
import type { OrderFm } from "@repo/shared/gen-types"
import { apiClient } from "@repo/shared/services/api-client"
import Cookies from "js-cookie"
import { type ComponentProps, useEffect } from "react"
import * as ordersServices from "./orders.services"

export function OrdersTable() {
  const COLUMN_DEFINITIONS: ComponentProps<typeof TableFa>["columnDefs"] = [
    { headerName: "مدیریت", cellRenderer: ManagementBtns, minWidth: 200 },
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
    {
      field: "side" as never,
      headerName: "نوع سفارش",
      valueFormatter: formatters.orderSide,
    },
    { field: "dlrCustomer" as never, headerName: "مشتری" },
    {
      field: "dlrPhone" as never,
      headerName: "موبایل",
      valueFormatter: formatters.persianNumber,
    },
    {
      field: "orderStatus" as never,
      headerName: "وضعیت سفارش",
      valueFormatter: formatters.orderStatus,
    },
    {
      field: "createDate" as never,
      headerName: "تاریخ ثبت",
      valueFormatter: formatters.date,
    },
    {
      field: "time" as never,
      headerName: "زمان",
      valueFormatter: formatters.timeHHmmss,
    },
    { field: "stockName" as never, headerName: "نام محصول" },
  ]
  const { connectionRef } = useSignalRContext()
  const dateFilterState = useDateFilter()
  const dataToSend = JSON.stringify({
    start: toISOStr(dateFilterState.fromDate),
    end: toISOStr(dateFilterState.toDate),
    countPerPage: 1000,
    pageNumber: 1,
  })
  const res = apiClient.useFetch<OrderFm[]>(() => ({
    endpoint: "/Master/GetOrders",
    method: "POST",
    body: dataToSend,
  }))

  useEffect(() => {
    if (!connectionRef.current) return

    connectionRef.current.on("ReceiveOrder2", () => res.reload())
    connectionRef.current.on("UpdateCOrder", () => res.reload())
    connectionRef.current.on("Decided", () => res.reload())

    // cleanup
    return () => {
      connectionRef.current.off("ReceiveOrder2")
      connectionRef.current.off("UpdateCOrder")
      connectionRef.current.off("Decided")
    }
  }, [connectionRef, connectionRef.current, res.reload])

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
    const { id, userID, orderStatus } = data

    function handleAcceptanceOrRejection(isAccepted: boolean) {
      const isConfirmed = confirm(`مطمئنی میخوای اینو ${isAccepted ? "تایید" : "رد"} کنی؟`)
      if (!isConfirmed) return

      ordersServices.accjectOrder(false, id, isAccepted, () => {
        connectionRef.current.invoke("DecideOrder", Cookies.get("ttkk"), isAccepted, id, userID)
        res.reload()
      })
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
