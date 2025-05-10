import { Btn, LabeledInput, Labeler, PriceInput } from "@/components"
import { MESSAGES } from "@/constants"
import { useSignalRContext } from "@/contexts/signalr.context"
import { ENUMS } from "@/enums"
import { useModal } from "@/hooks"
import { priceToToman } from "@/utils"
import type { OrderFm, OrderSide, ReqOrderDto, RequestOrderMode } from "emex-shared/gen-types"
import { apiClient } from "emex-shared/services/api-client"
import Cookies from "js-cookie"
import { type ChangeEvent, type FormEvent, useEffect, useId, useRef, useState } from "react"
import { toast } from "react-toastify"
import { OrderModal, OrderModalState } from "./order-modal.component"
import { getOrderStatusByID, requestOrder } from "./product.service"

const isRound = (num: string | number) => Number(num) === Math.floor(Number(num))

interface ProductFormProps {
  id: number
  basePrice: number
  onRefusion: () => void
  modeText: string
  unitPriceRatio: number
  decimalNumber: number
  totalBuyPrice: number
  totalSellPrice: number
  maxAutoMin: number | null
  mode: number
  unit: number
  minValue: number
  maxValue: number
  minVolume: number
  maxVolume: number
  supply: number
}

export function ProductForm({
  id,
  basePrice,
  onRefusion,
  modeText,
  unitPriceRatio,
  decimalNumber,
  totalBuyPrice,
  totalSellPrice,
  maxAutoMin,
  mode,
  unit,
  minVolume,
  maxVolume,
}: ProductFormProps) {
  const { connectionRef } = useSignalRContext()
  const [weight, setWeight] = useState("")
  const [tradeValue, setTradeValue] = useState("")
  const [isBuyingInWeightMode, setIsBuyingWeightMode] = useState(true)
  const [modalState, setModalState] = useState(OrderModalState.NoAnswer)
  const isAutoMode = mode !== ENUMS.AUTO_MODE.NORMAL && maxAutoMin !== 0 && maxAutoMin !== null
  const modal = useModal()
  const targetInputRef = useRef<HTMLInputElement | null>(null)
  const priceInputID = `price-input-${useId()}`
  const tomanTradeValue = `${priceToToman(tradeValue)} تومن`
  const isReady = tradeValue && weight
  const [isVolumeFocused, setIsVolumeFocused] = useState(false)
  const isVolumeMode = isBuyingInWeightMode
  const isValueMode = !isBuyingInWeightMode

  // Focus targeted input on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    targetInputRef.current?.focus()
    if (unit === 1) {
      setIsBuyingWeightMode(true)
    } else {
      setIsBuyingWeightMode(false)
    }
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(resetFormWithoutClosing, [isBuyingInWeightMode])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(handleTradeValueChange, [tradeValue])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setWeight("")
    setTradeValue("")
  }, [isBuyingInWeightMode, modeText])

  function handleFormReset() {
    setWeight("")
    setTradeValue("")
  }

  function handleWeightChange(e: ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value)
    setWeight(e.target.value || "")
    setTradeValue(
      Math.round(
        (value * (modeText === "خرید" ? totalBuyPrice : totalSellPrice)) / unitPriceRatio,
      ).toString(),
    )
  }

  function handleTradeValueChange() {
    if (!isVolumeFocused) return
    setWeight(
      Number.parseFloat(
        ((Number(tradeValue) / basePrice) * unitPriceRatio).toFixed(decimalNumber),
      ).toString(),
    )
  }

  function resetFormWithoutClosing() {
    setWeight("")
    setTradeValue("")
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // if (modeText === "خرید" && weight > supply) {
    //   toast.error(`نمیتوان بیشتر از مقدار موجود خرید؛ مقدار موجود ${supply} ${unit === 1 ? "تعداد" : "گرم"} است`)
    //   return
    // }

    if (minVolume !== 0 && Number(weight) < minVolume) {
      toast.warning(`حداقل مقدار معامله ${minVolume} است`)
      return
    }

    if (unit === 1 && !isRound(weight)) {
      toast.warning("در حالت تعدادی برای مقدار، نمیتوان عدد اعشاری وارد کرد")
      return
    }

    if (maxVolume !== 0 && Number(weight) > maxVolume) {
      toast.warning(
        `مقدار واردشده بیشتر از حد مجاز هست. برای مقادیر بیشتر از ${maxVolume} ${unit === 1 ? "تعداد" : "گرم"} با فروشگاه تماس بگیرین`,
      )
      return
    }

    const data: Required<ReqOrderDto> = {
      tyStockID: Number(id),
      side: (modeText === "خرید" ? ENUMS.ORDER_SIDE.BUY : ENUMS.ORDER_SIDE.SELL) as OrderSide,
      mode: (isValueMode
        ? ENUMS.PRODUCT_PURCHASE_MODE.VALUE
        : ENUMS.PRODUCT_PURCHASE_MODE.VOLUME) as RequestOrderMode,
      price: modeText === "خرید" ? totalBuyPrice : totalSellPrice,
      volume: +Number.parseFloat(Number(weight).toFixed(decimalNumber)),
      value: modeText === "خرید" ? Number(tradeValue) : -Number(tradeValue),
    }

    requestOrder(data, orderData => {
      connectionRef.current.invoke("RequestOrder", Cookies.get("ttkk"), orderData.id)
      connectionRef.current.on("Decided", onDecided)

      function onDecided(isAccepted: boolean, orderID: number) {
        // biome-ignore lint/suspicious/noDoubleEquals: <explanation>
        if (orderData.id != orderID) return

        setModalState(isAccepted ? OrderModalState.Agreed : OrderModalState.Disagreed)
      }

      if (!isAutoMode) {
        modal.openModal()
        return
      }

      setModalState(OrderModalState.Waiting)
      modal.openModal()

      async function onTimerEnd() {
        apiClient.fetch<OrderFm>({
          endpoint: `/Customer/GetOrderByID/${orderData.id}`,
          onSuccess(data) {
            toast.success(MESSAGES.SUCCESS_DESCRIPTION)
            const isAccepted = data?.orderStatus === ENUMS.ORDER_STATUS.ACCEPTED
            const isRejected = data?.orderStatus === ENUMS.ORDER_STATUS.REJECTED

            connectionRef.current.invoke("UpdateOrder", Cookies.get("ttkk"), data.id)

            if (isAccepted) setModalState(OrderModalState.Agreed)
            else if (isRejected) setModalState(OrderModalState.Disagreed)
            else setModalState(OrderModalState.NoAnswer)
          },
          onError(err) {
            toast.error(err)
            setModalState(OrderModalState.Error)
          },
        })
      }

      setTimeout(onTimerEnd, maxAutoMin * 60 * 1000)
    })
  }

  return (
    <>
      <OrderModal modal={modal} state={modalState} seconds={maxAutoMin * 60} />

      <form className="flex flex-col gap-2" onReset={handleFormReset} onSubmit={handleSubmit}>
        <LabeledInput
          ref={targetInputRef}
          value={weight}
          onChange={handleWeightChange}
          label={`مقدار (${unit === 1 ? "تعداد" : "گرم"}) ${minVolume ? `(حداقل ${minVolume})` : ""}`}
          className="h-10 text-xs"
          labelClassName="text-xs"
          labelTextSecondary={unit === 1 ? "اعداد اعشاری وارد نکنید" : ""}
          pattern={unit === 1 ? "^[0-9]+$" : "^[0-9]+(.[0-9]{1,2})?$"}
        />

        <Labeler
          label1={"ارزش معامله (ریال)"}
          label2={tomanTradeValue}
          id={priceInputID}
          label1ClassName="text-xs"
        >
          <PriceInput
            readOnly={isVolumeMode}
            price={tradeValue}
            setPrice={setTradeValue}
            id={priceInputID}
            onFocus={() => setIsVolumeFocused(true)}
            onBlur={() => setIsVolumeFocused(false)}
            className="h-10 text-sm"
          />
        </Labeler>

        <div className="flex gap-2">
          <Btn className="w-full h-6 px-2 text-xs" onClick={onRefusion}>
            انصراف
          </Btn>
          <Btn
            disabled={!isReady}
            className="w-full h-6 px-2 text-xs"
            theme="primary"
            themeType="filled"
            type="submit"
          >
            {modeText}
          </Btn>
        </div>
      </form>
    </>
  )
}
