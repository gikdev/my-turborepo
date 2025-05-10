import { Btn, Heading, TableFa } from "@/components"
import { formatters } from "@/helpers"
import { TitledCard } from "@/layouts"
import { ArrowCounterClockwise, Eye, Pen, Plus, Trash } from "@phosphor-icons/react"
import { apiClient } from "emex-shared/services/api-client"
import { Link } from "wouter"
import * as customerServices from "./customer.services"

export function CustomersTable() {
  const res = apiClient.useFetch(() => ({
    endpoint: "/Master/GetCustomers",
  }))
  const COLUMN_DEFINITIONS = [
    {
      field: "id",
      headerName: "آیدی",
      valueFormatter: formatters.persianNumber,
    },
    {
      field: "groupName",
      headerName: "گروه گرمی",
      valueFormatter: formatters.persianNumber,
    },
    {
      field: "groupIntName",
      headerName: "گروه عددی",
      valueFormatter: formatters.persianNumber,
    },
    { field: "displayName", headerName: "نام" },
    {
      field: "mobile",
      headerName: "موبایل",
      valueFormatter: formatters.persianNumber,
    },
    {
      field: "codeMelli",
      headerName: "کد ملی",
      valueFormatter: formatters.persianNumber,
    },
    { field: "isActive", headerName: "فعال هست؟" },
    { field: "isBlocked", headerName: "مسدود کردن معامله" },
    {
      field: "allowedDevices",
      headerName: "تعداد دستگاه های مجاز",
      valueFormatter: formatters.persianNumber,
    },
    { headerName: "مدیریت", cellRenderer: ManagementBtns },
  ]

  return (
    <>
      <TitledCard className="w-full flex flex-col sm:flex-row mx-auto mb-4 sm:items-center gap-4">
        <Heading as="h3" size={2} className="text-slatedark-12 text-center me-0 sm:me-auto">
          مدیریت کاربران
        </Heading>
        <Btn icon={ArrowCounterClockwise} onClick={() => res.reload()}>
          تازه سازی
        </Btn>
        <Btn icon={Plus} as={Link} theme="success" themeType="filled" href="/customers/manage?new">
          کاربر جدید
        </Btn>
      </TitledCard>
      <TableFa className="h-[40rem]" rowData={res.data} columnDefs={COLUMN_DEFINITIONS} />
    </>
  )

  function ManagementBtns(props) {
    const id = props.data.id

    function handleDelete() {
      const isConfirmed = confirm("مطمئنی میخوای اینو پاک کنی؟")
      if (isConfirmed)
        customerServices.$delete(
          {
            gid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            id,
            tf: true,
            str: "string",
          },
          () => response.mutate(),
        )
    }

    return (
      <div className="flex gap-2 justify-end">
        <abbr title="مشاهده جزییات">
          <Btn as={Link} href={`/customers/${id}`} className="w-10 p-0" theme="info" icon={Eye} />
        </abbr>

        <abbr title="ویرایش کاربر">
          <Btn
            as={Link}
            href={`/customers/manage?id=${id}`}
            className="w-10 p-0"
            theme="warning"
            icon={Pen}
          />
        </abbr>

        <abbr title="حذف کاربر">
          <Btn onClick={handleDelete} className="w-10 p-0" theme="error" icon={Trash} />
        </abbr>
      </div>
    )
  }
}
