import { Btn, LabeledInput, SelectOneTable } from "@/components"
import { formatters } from "@/helpers"
import { TitledCard } from "@/layouts"
import { PenNib } from "@phosphor-icons/react"
import { type ComponentProps, type FormEvent, useCallback, useRef, useState } from "react"
import { toast } from "react-toastify"
import { apiClient } from "vgold-shared/services/api-client"

const COLUMN_DEFS: ComponentProps<typeof SelectOneTable>["columnDefs"] = [
  { field: "name" as never, headerName: "نام محصول", checkboxSelection: true },
  { field: "description" as never, headerName: "توضیحات" },
  { field: "price" as never, headerName: "قیمت", valueFormatter: formatters.rial },
  { field: "status" as never, headerName: "وضعیت", valueFormatter: formatters.productStatus },
  { field: "supply" as never, headerName: "مقدار مانده", valueFormatter: formatters.persianNumber },
]

export function NewTransferForm({ signaler }) {
  const [selection, setSelection] = useStatyRef([])
  const [isLoading, setLoading] = useState(false)
  const transfersRes = apiClient.useFetch<unknown[]>(() => ({
    endpoint: "/TyStocks/ForCustommer",
  }))

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const form = e.target as HTMLFormElement
    const title = form.elements.namedItem("title") as HTMLInputElement
    const mobile = form.elements.namedItem("mobile") as HTMLInputElement
    const description = form.elements.namedItem("description") as HTMLInputElement
    const weight = form.elements.namedItem("weight") as HTMLInputElement

    const dataToSend = JSON.stringify({
      name: title.value,
      description: description.value,
      mobile: mobile.value,
      tyStockID: selection.current,
      volume: Number.parseFloat(weight.value),
    })

    apiClient.fetch({
      endpoint: "/Customer/AddTransfer",
      method: "POST",
      body: dataToSend,
      onBeforeStart: () => setLoading(true),
      onSuccess: () => toast.success("با موفقیت انجام شد"),
      onFinally() {
        form.reset()
        setLoading(false)
        signaler.run("refetch")
      },
    })
  }

  return (
    <TitledCard onSubmit={handleSubmit} as="form" title="حواله جدید">
      <SelectOneTable
        className="h-[30rem] mb-4"
        rowData={transfersRes.data}
        columnDefs={COLUMN_DEFS}
        setSelection={setSelection}
        selectionKey="id"
      />
      <div className="flex flex-col mb-4 md:flex-row gap-4 justify-center items-center *:w-full">
        <LabeledInput dir="rtl" name="title" label="عنوان" />
        <LabeledInput step="0.01" name="weight" type="number" label="وزن" />
      </div>
      <div className="flex flex-col mb-4 md:flex-row gap-4 justify-center items-center *:w-full">
        <LabeledInput name="mobile" type="number" label="موبایل" />
        <LabeledInput dir="rtl" name="description" label="توضیحات" />
      </div>
      <Btn
        type="submit"
        isLoading={isLoading}
        className="w-full h-12"
        icon={PenNib}
        themeType="filled"
        theme="primary"
      >
        ثبت
      </Btn>
    </TitledCard>
  )
}

function useStatyRef<T>(defaultValue: T) {
  const value = useRef<T>(defaultValue)
  const setValue = useCallback((newValue: T) => {
    value.current = newValue
  }, [])

  return [value, setValue] as const
}
