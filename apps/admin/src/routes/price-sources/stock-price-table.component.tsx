import { Btn, Heading, TableFa } from "@/components"
import { formatters } from "@/helpers"
import { TitledCard } from "@/layouts"
import { ArrowCounterClockwise, Pen, Plus, Trash } from "@phosphor-icons/react"
import type { StockPriceSourceResponse } from "@repo/shared/gen-types"
import { apiClient } from "@repo/shared/services/api-client"
import type { ComponentProps, FormEvent } from "react"
import { Link } from "wouter"
import { removePriceSource } from "./price-source.service"

export function StockPriceSources() {
  const res = apiClient.useFetch<StockPriceSourceResponse[]>(() => ({
    endpoint: "/StockPriceSource/GetStockPriceSources",
  }))

  const COLUMN_DEFINITIONS: ComponentProps<typeof TableFa>["columnDefs"] = [
    {
      field: "name" as never,
      headerName: "نام",
    },
    {
      field: "sourceUrl" as never,
      headerName: "آدرس",
    },
    {
      field: "price" as never,
      headerName: "قیمت",
      valueFormatter: formatters.rial,
    },
    {
      field: "code" as never,
      headerName: "کد",
      valueFormatter: formatters.persianNumber,
    },
    { headerName: "مدیریت", cellRenderer: ManagementBtns },
  ]

  return (
    <>
      <TitledCard className="w-full flex flex-col sm:flex-row mx-auto mb-4 sm:items-center gap-4">
        <Heading as="h3" size={2} className="text-slatedark-12 text-center me-0 sm:me-auto">
          مدیریت منبع قیمت
        </Heading>
        <Btn icon={ArrowCounterClockwise} onClick={() => res.reload()}>
          تازه سازی
        </Btn>
        <Btn
          icon={Plus}
          as={Link as unknown as string}
          theme="success"
          themeType="filled"
          href="/price-sources/manage?new"
        >
          منبع قیمت جدید
        </Btn>
      </TitledCard>
      <TableFa className="h-[40rem]" rowData={res.data} columnDefs={COLUMN_DEFINITIONS} />
    </>
  )

  function ManagementBtns({ data: { id } }: { data: { id: number } }) {
    function handleDelete(e: FormEvent<HTMLFormElement>) {
      e.preventDefault()

      const isConfirmed = confirm("مطمئنی میخوای اینو پاک کنی؟")
      if (isConfirmed) removePriceSource(id, () => res.reload())
    }

    return (
      <div className="flex gap-2 justify-end">
        <Btn
          as={Link as unknown as string}
          href={`/price-sources/manage?id=${id}`}
          className="w-10 p-0"
          theme="warning"
          icon={Pen}
        />
        <Btn onClick={handleDelete} className="w-10 p-0" theme="error" icon={Trash} />
      </div>
    )
  }
}
