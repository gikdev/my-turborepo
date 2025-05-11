import { Btn, LabeledInput, LabeledUploadInput, Switch } from "@/components"
import { uploadFile } from "@/helpers"
import { TitledCard } from "@/layouts"
import { Pen } from "@phosphor-icons/react"
import { type FormEvent, useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import type { ReqAcceptDocMasterDto } from "vgold-shared/gen-types"
import { apiClient } from "vgold-shared/services/api-client"

export function DocForm({ signaler, customerID }) {
  const docTitleRef = useRef(null)
  const docFileRef = useRef(null)
  const priceInputRef = useRef(null)
  const priceRef = useRef("")

  const [isPayment, setIsPayment] = useState(true)
  const [loading, setLoading] = useState(false)

  function formatNumber(value: string) {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  function handlePriceChange(e) {
    const input = e.target
    const rawValue = input.value.replace(/,/g, "") // حذف , قبل از پردازش
    const formattedValue = formatNumber(rawValue)

    // ذخیره مقدار در useRef برای جلوگیری از ری-رندر
    priceRef.current = formattedValue

    // محاسبه مکان جدید نشانگر
    const cursorPosition = input.selectionStart + (formattedValue.length - rawValue.length)

    // تنظیم مقدار روی input بدون استفاده از state (جلوگیری از رندر مجدد)
    input.value = formattedValue

    // حفظ مکان نشانگر
    setTimeout(() => {
      input.setSelectionRange(cursorPosition, cursorPosition)
    }, 0)
  }

  function handleSubmission(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const docTitle = docTitleRef.current.value
    const docFile = docFileRef.current.files[0]
    const priceValue = Number.parseFloat(priceRef.current.replace(/,/g, "")) || 0 // حذف , و تبدیل به عدد

    let finalPrice = Math.abs(priceValue)
    if (!isPayment) {
      finalPrice = -finalPrice
    }

    if (finalPrice === 0) {
      alert("مقدار وارد شده باید بزرگتر از صفر باشد.")
      return
    }

    const finalData: ReqAcceptDocMasterDto = {
      title: docTitle,
      tyOrderID: null,
      value: finalPrice,
      tyCustomerID: customerID,
    }

    apiClient.fetch({
      endpoint: "/Master/AddAndAcceptDocs",
      method: "POST",
      body: () => JSON.stringify(finalData),
      async onBeforeStart() {
        setLoading(true)
        if (!docFile) return
        const GUID = await uploadFile(docFile, true)
        finalData.docId = GUID
      },
      onSuccess() {
        toast.success("با موفقیت انجام شد")
        signaler?.runAll?.("close form", "reload data")
        priceRef.current = ""
        if (priceInputRef.current) priceInputRef.current.value = ""
      },
      onFinally: () => setLoading(false),
    })
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (priceInputRef.current) {
      priceInputRef.current.value = priceRef.current
    }
  }, [isPayment])

  return (
    <TitledCard as="form" onSubmit={handleSubmission} title="دریافتی و پرداختی ریالی">
      <div className="flex justify-center items-center mb-4 gap-x-2 mt-5">
        <span className={`transition ${!isPayment ? "text-red-500" : ""}`}>پرداختی</span>

        <Switch
          checked={isPayment}
          customCheckedColor="bg-red-9"
          customUnCheckedColor="bg-green-9"
          onCheckedChange={setIsPayment}
          specialColor
        />

        <span className={`transition ${isPayment ? "text-green-500" : ""}`}>دریافتی</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 items-end mt-5">
        <LabeledInput
          required
          dir="rtl"
          name="docTitle"
          label="عنوان"
          ref={docTitleRef}
          defaultValue={docTitleRef.current?.value || ""}
        />
        <LabeledUploadInput name="doc" label="فایل سند" ref={docFileRef} />
        <LabeledInput
          required
          name="price"
          label="مقدار (ریال)"
          type="text"
          ref={priceInputRef} // مقدار اینپوت مستقیماً کنترل می‌شود
          onChange={handlePriceChange}
        />
        <Btn type="submit" theme="primary" themeType="filled" icon={Pen} disabled={loading}>
          {loading ? "در حال ارسال..." : "ثبت"}
        </Btn>
      </div>
    </TitledCard>
  )
}
