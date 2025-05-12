import { Btn, LabeledInput, SelectOneTable } from "@/components"
import { formatters, logOut, uploadFile } from "@/helpers"
import { TitledCard } from "@/layouts"
import { toISOStr } from "@/utils"
import { PenNib } from "@phosphor-icons/react"
import { captureException } from "@sentry/react"
import { type ComponentProps, useCallback, useRef, useState } from "react"
import { toast } from "react-toastify"
import { ERROR_MSGS, apiClient } from "vgold-shared/services/api-client"
import { LabeledUploadInput } from "../profile/labeled-upload-input.component" // TODO

const COLUMN_DEFS: ComponentProps<typeof SelectOneTable>['columnDefs'] = [
  {
    field: "id" as never,
    headerName: "آیدی",
    valueFormatter: formatters.persianNumber,
    checkboxSelection: true,
  },
  { field: "stockName" as never, headerName: "نام محصول" },
  { field: "price" as never, headerName: "قیمت", valueFormatter: formatters.rial },
  { field: "volume" as never, headerName: "مقدار", valueFormatter: formatters.persianNumber },
  { field: "value" as never, headerName: "ارزش معامله (ریال)", valueFormatter: formatters.persianComma },
  { field: "orderStatus" as never, headerName: "وضعیت سفارش", valueFormatter: formatters.orderStatus },
  { field: "side" as never, headerName: "نوع سفارش", valueFormatter: formatters.orderSide },
  { field: "time" as never, headerName: "آخرین به روز رسانی", valueFormatter: formatters.date },
]

const dataToSend = JSON.stringify({
  start: toISOStr(new Date(0)),
  end: toISOStr(new Date()),
  countPerPage: 1000,
  pageNumber: 1,
})

export function NewDocForm({ signaler }) {
  const [selection, setSelection] = useStatyRef()
  const [isLoading, setLoading] = useState(false)
  const ordersRes = apiClient.useFetch<unknown[]>(() => ({
    endpoint: "/Customer/GetOrders",
    method: "POST",
    body: dataToSend,
  }))

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const form = e.target as HTMLFormElement
    const title = form.elements.namedItem("title") as HTMLInputElement
    const doc = form.elements.namedItem("doc") as HTMLInputElement

    Promise.resolve()
      .then(() => setLoading(true))
      .then(() => uploadFile(doc.files[0], true))
      .then(async GUID => {
        const dataToSend = JSON.stringify({
          docId: GUID,
          title: title.value,
          tyOrderID: selection.current,
        })

        const res = apiClient.fetch({
          endpoint: "/Customer/AddDocs",
          method: "POST",
          body: dataToSend,
          returnRes: true,
        }) as unknown as Response

        const isJSONType = (res.headers.get("Content-Type") || "").includes("application/json")
        if (!res.ok) {
          const errorBody: string = isJSONType ? await res.json() : await res.text()

          let errorMsg =
            typeof errorBody === "string" ? errorBody : ERROR_MSGS[res.status] || ERROR_MSGS.GENERAL
          errorMsg = errorMsg.trim() === "" ? ERROR_MSGS.GENERAL_SIMPLE : errorMsg

          if (res.status === 401) {
            logOut()
            console.warn("logout!")
          }

          captureException(errorMsg)
          toast.error(errorMsg)
          console.error(errorMsg)
          return undefined
        }
        return res
      })
      .then(() => toast.success("انجام شد."))
      .catch(err => {
        captureException(err)
        toast.error(`یه مشکلی پیش اومد: ${err.statusCode}`)
        console.error(err)
      })
      .finally(() => {
        form.reset()
        setLoading(false)
        signaler.run("refetch")
      })
  }

  return (
    <TitledCard onSubmit={handleSubmit} as="form" title="سند جدید">
      <SelectOneTable
        className="h-[30rem] mb-4"
        rowData={ordersRes.data}
        columnDefs={COLUMN_DEFS}
        setSelection={setSelection}
        selectionKey="id"
      />
      <div className="flex flex-col mb-4 md:flex-row gap-4 justify-center items-center *:w-full">
        <LabeledInput name="title" label="عنوان" />
        <LabeledUploadInput name="doc" labelText="فایل سند" />
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

function useStatyRef<T = undefined>(defaultValue = undefined) {
  const value = useRef(defaultValue)
  const setValue = useCallback((newValue: T) => {
    value.current = newValue
  }, [])

  return [value, setValue] as const
}
