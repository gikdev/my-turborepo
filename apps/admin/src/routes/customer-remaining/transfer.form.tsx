import { Btn, LabeledInput, Switch } from "@/components"
import { MESSAGES } from "@/constants"
import { TitledCard } from "@/layouts"
import { Pen } from "@phosphor-icons/react"
import { type FormEvent, useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { apiClient } from "vgold-shared/services/api-client"

export function TransferForm({ signaler, defaultMobile = "", customerID, stockID }) {
  const [isPayment, setIsPayment] = useState(true)
  const [loading, setLoading] = useState(false)
  const weightInputRef = useRef(null)
  const weightValueRef = useRef("")
  const descriptionInputRef = useRef(null)
  const descriptionValueRef = useRef("")

  function handleSubmission(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const form = e.target as HTMLFormElement

    const mobileFieldValue = (form.elements.namedItem("mobile") as HTMLInputElement)?.value
    const weightValue = Number.parseFloat(
      (form.elements.namedItem("weight") as HTMLInputElement)?.value,
    )
    const descriptionValue = (form.elements.namedItem("description") as HTMLInputElement)?.value

    let volumeValue = Math.abs(weightValue)
    volumeValue = isPayment ? -volumeValue : volumeValue

    if (volumeValue === 0) {
      alert("مقدار وارد شده باید بزرگتر از صفر باشد.")
      return
    }

    const dataToSend = JSON.stringify({
      tyCustomerID: customerID,
      tyStockID: stockID,
      mobile: mobileFieldValue,
      volume: volumeValue,
      description: descriptionValue,
    })

    apiClient.useFetch(() => ({
      endpoint: "/Master/AddAndAcceptTransfer",
      method: "POST",
      body: dataToSend,
      onFinally: () => setLoading(false),
      onSuccess() {
        toast.success(MESSAGES.SUCCESS_DESCRIPTION)
        signaler?.runAll?.("close form", "reload data")
        form.reset()
      },
    }))
  }

  // Preserve input value when Switch changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (weightInputRef.current) {
      weightInputRef.current.value = weightValueRef.current
    }
    if (descriptionInputRef.current) {
      descriptionInputRef.current.value = descriptionValueRef.current
    }
  }, [isPayment])

  return (
    <TitledCard as="form" onSubmit={handleSubmission} title="دریافتی و پرداختی طلایی">
      <div className="flex items-center justify-center mb-4 gap-x-2 mt-5">
        <span>پرداختی</span>
        <Switch
          checked={isPayment}
          customCheckedColor="bg-reddark-9"
          customUnCheckedColor="bg-greendark-9"
          onCheckedChange={setIsPayment}
        />
        <span>دریافتی</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 items-end mt-5">
        <LabeledInput
          required
          ref={weightInputRef}
          name="weight"
          label="وزن"
          type="text"
          pattern="^\d+(\.\d+)?$"
          labelTextSecondary="فقط عدد وارد کنید!"
          onChange={(e: { target: { value: string } }) => {
            weightValueRef.current = e.target.value
          }}
        />

        <LabeledInput
          required
          name="mobile"
          label="موبایل"
          dir="ltr"
          type="number"
          defaultValue={defaultMobile}
          disabled
        />

        <LabeledInput
          ref={descriptionInputRef}
          name="description"
          dir="rtl"
          label="توضیحات"
          onChange={(e: { target: { value: string } }) => {
            descriptionValueRef.current = e.target.value
          }}
        />

        <Btn type="submit" theme="primary" themeType="filled" icon={Pen} disabled={loading}>
          {loading ? "در حال ارسال..." : "ثبت"}
        </Btn>
      </div>
    </TitledCard>
  )
}
