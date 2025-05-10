import { Btn, PriceInput } from "@/components"
import { priceToRial } from "@/utils"
import { CaretDown, CaretUp, Check, Pen } from "@phosphor-icons/react"
import { useState } from "react"

const btnsSharedProps = { className: "p-0 w-10" }

export function PriceControl({
  id,
  index,
  title,
  rawPrice,
  textTheme,
  caretUpHandler,
  caretDownHandler,
  penHandler,
}) {
  const [isEditingMode, setEditingMode] = useState(false)
  const [price, setPrice] = useState(rawPrice)
  const priceText = priceToRial(rawPrice)

  const handlePriceSubmission = () => penHandler(index, price)

  return (
    <div className="flex gap-2 flex-col">
      <p className="text-xs text-center">{title} (ریال):</p>
      <div className="flex flex-row-reverse md:flex-col gap-2 items-center justify-between">
        {isEditingMode ? (
          <PriceInput price={price} setPrice={setPrice} className="py-2" />
        ) : (
          <p dir="ltr" className={`text-2xl md:text-3xl font-black ${textTheme}`}>
            {priceText}
          </p>
        )}

        <div className="flex gap-2">
          <Btn
            onClick={() => caretUpHandler(index)}
            {...btnsSharedProps}
            theme="success"
            icon={CaretUp}
            disabled={isEditingMode}
          />

          {isEditingMode ? (
            <Btn
              onClick={() => {
                setEditingMode(p => !p)
                handlePriceSubmission()
              }}
              {...btnsSharedProps}
              theme="success"
              icon={Check}
            />
          ) : (
            <Btn
              onClick={() => {
                setEditingMode(p => !p)
              }}
              {...btnsSharedProps}
              theme="warning"
              icon={Pen}
            />
          )}
          <Btn
            onClick={() => caretDownHandler(index)}
            {...btnsSharedProps}
            theme="error"
            icon={CaretDown}
            disabled={isEditingMode}
          />
        </div>
      </div>
    </div>
  )
}
