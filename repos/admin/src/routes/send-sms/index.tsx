import { Btn, Labeler, Switch, Textarea } from "@/components"
import ExceptionCaptureErrorBoundaryCard from "@/components/exception-capture-error-boundary-card"
import { useInEveryPage } from "@/hooks"
import { HeadingLine } from "@/layouts"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mailbox } from "@phosphor-icons/react"
import { SpinnerGap } from "@phosphor-icons/react/dist/ssr"
import type { SelectionChangedEvent } from "ag-grid-community"
import { apiClient } from "emex-shared/services/api-client"
import { type ComponentProps, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import * as z from "zod"
import { TableMutliSelect } from "./table-mutliselect"

interface Customer {
  id: number
  masterID: number
  groupID: number | null
  groupIntID: number | null
  displayName: string
  mobile: string
  codeMelli: string | null
  address: string | null
  city: string | null
  melliID: string | null
  kasbsID: string | null
  isActive: boolean
  isBlocked: boolean
  allowedDevices: number
  connectedDevices: number
  groupName: string | null
  groupIntName: string | null
}

const columnDefs: ComponentProps<typeof TableMutliSelect>["columnDefs"] = [
  { field: "displayName" as never, headerName: "نام" },
  { field: "groupName" as never, headerName: "گروه گرمی" },
  { field: "groupIntName" as never, headerName: "گروه عددی" },
  { field: "mobile" as never, headerName: "موبایل" },
  { field: "codeMelli" as never, headerName: "کد ملی" },
  { field: "isActive" as never, headerName: "فعال هست؟" },
  { field: "isBlocked" as never, headerName: "مسدود کردن معامله" },
  { field: "allowedDevices" as never, headerName: "تعداد دستگاه های مجاز" },
]

const SendSmsFormSchema = z.object({
  smsText: z.string().min(1, { message: "پر کردن این ورودی الزامی‌است" }),
})
type SendSmsFormData = z.infer<typeof SendSmsFormSchema>

interface SMSBroadcastPaylod {
  toAll: boolean
  receivers: number[] | null
  message: string
}

export function SendSMS() {
  useInEveryPage()
  const [toAll, setAll] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [userIDs, setUserIDs] = useState<number[]>([])
  const customersRes = apiClient.useFetch<Customer[]>(() => ({
    endpoint: "/Master/GetCustomers",
    defaultValue: [],
  }))
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SendSmsFormData>({
    resolver: zodResolver(SendSmsFormSchema),
  })

  function onSelectionChanged(e: SelectionChangedEvent) {
    const selectedItems = e.api.getSelectedRows()
    setUserIDs(selectedItems.map(i => i.id))
  }

  async function onSubmit(data: Required<SendSmsFormData>) {
    const dataToSend = {
      toAll,
      receivers: userIDs,
      message: data.smsText,
    } satisfies SMSBroadcastPaylod

    apiClient.fetch({
      method: "POST",
      endpoint: "/Master/sms/broadcast",
      body: JSON.stringify(dataToSend),
      onBeforeStart: () => setLoading(true),
      onFinally: () => setLoading(false),
      onSuccess: () => {
        toast.success("با موفقیت انجام شد")
        reset()
      },
    })
  }

  return (
    <HeadingLine title="ارسال پیامک" className="grid xl:grid-cols-2 gap-2">
      <ExceptionCaptureErrorBoundaryCard>
        <div className="h-[40rem] relative">
          {toAll && (
            <div className="absolute bg-slatedark-1/50 top-0 bottom-0 right-0 left-0 w-auto h-auto z-40 rounded-lg" />
          )}
          <TableMutliSelect
            onSelectionChanged={onSelectionChanged}
            rowData={customersRes.data}
            columnDefs={columnDefs}
          />
        </div>

        <form
          className="flex flex-col gap-5 max-w-[40rem] w-full xl:max-w-auto mx-auto xl:mx-0 p-5 bg-slatedark-2 rounded-md border border-slatedark-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
          <label className="flex gap-2 items-center select-none cursor-pointer hover:bg-slatedark-3 p-1 rounded-md">
            <Switch checked={toAll} onCheckedChange={setAll} />
            <span>ارسال به تمام کاربران</span>
          </label>
          {!toAll && userIDs.length === 0 && (
            <p className="text-reddark-10 text-xs">
              لطفا حداقل یه کاربر انتخاب کنید یا گزینه «ارسال به تمام کاربران» را انتخاب کنید
            </p>
          )}

          <Labeler label1="پیغام *" error={errors?.smsText?.message} label1ClassName="font-bold">
            <Textarea className="h-40" {...register("smsText")} />
          </Labeler>

          <p className="text-reddark-10 text-xs">{errors.root?.message}</p>

          <Btn
            className="flex gap-2 items-center font-bold"
            disabled={isLoading}
            themeType="filled"
            theme="primary"
            icon={isLoading ? SpinnerGap : Mailbox}
            type="submit"
          >
            ارسال
          </Btn>
        </form>
      </ExceptionCaptureErrorBoundaryCard>
    </HeadingLine>
  )
}
