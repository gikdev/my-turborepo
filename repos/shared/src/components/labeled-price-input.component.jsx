import { forwardRef } from "react"
import { Labeler, PriceInput } from "."
import { priceToToman } from "../utils"

function LabeledPriceInputComponent({ label, toman, hideLabel2, error, ...other }, ref) {
  const finalToman = typeof toman === "number" ? `${priceToToman(toman)} تومان` : toman

  return (
    <Labeler label1={label} label2={hideLabel2 ? undefined : finalToman} error={error}>
      <PriceInput {...other} ref={ref} />
    </Labeler>
  )
}

export const LabeledPriceInput = forwardRef(LabeledPriceInputComponent)
