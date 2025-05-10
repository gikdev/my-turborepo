import { Btn, Heading, TableFa } from "@/components"
import { formatters } from "@/helpers"
import { TitledCard } from "@/layouts"
import { ArrowCounterClockwise, Pen, Plus, Trash } from "@phosphor-icons/react"
import { apiClient } from "@repo/shared/services/api-client"
import { Link } from "wouter"
import { deleteGroup } from "./groups-number.services"

export function GroupsNumberTable() {
  const res = apiClient.useFetch(() => ({
    endpoint: "/TyCustomerGroupIntInts",
  }))
  const COLUMN_DEFINITIONS = [
    { field: "id", headerName: "آیدی", valueFormatter: formatters.persianNumber }, // persianNumber
    { field: "name", headerName: "نام" },
    { field: "description", headerName: "توضیح" },
    { field: "diffBuyPrice", headerName: "اختلاف خرید مشتری", valueFormatter: formatters.toman }, // toman
    { field: "diffSellPrice", headerName: "اختلاف فروش مشتری", valueFormatter: formatters.toman }, // toman
    { headerName: "مدیریت", cellRenderer: The2Btns },
  ]

  return (
    <>
      <TitledCard className="w-full flex flex-col sm:flex-row mx-auto mb-4 sm:items-center gap-4">
        <Heading as="h3" size={2} className="text-slatedark-12 text-center me-0 sm:me-auto">
          مدیریت گروه‌های عددی
        </Heading>
        <Btn icon={ArrowCounterClockwise} onClick={() => res.reload()}>
          تازه سازی
        </Btn>
        <Btn
          disabled
          icon={Plus}
          as={Link}
          theme="success"
          themeType="filled"
          href="/groups-number/manage?new"
        >
          گروه جدید
        </Btn>
      </TitledCard>
      <TableFa className="h-[40rem]" rowData={res.data} columnDefs={COLUMN_DEFINITIONS} />
    </>
  )

  function The2Btns(props) {
    const id = props.data.id

    function handleDelete() {
      const isConfirmed = confirm("مطمئنی میخوای اینو پاک کنی؟")
      if (isConfirmed) deleteGroup(id, () => res.reload())
    }

    return (
      <div className="flex gap-2 justify-end">
        <Btn
          as={Link}
          href={`/groups-number/manage?id=${id}`}
          className="w-10 p-0"
          theme="warning"
          icon={Pen}
        />
        <Btn onClick={handleDelete} className="w-10 p-0" theme="error" icon={Trash} />
      </div>
    )
  }
}
