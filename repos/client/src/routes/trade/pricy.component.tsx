import { Btn } from "@/components"
import { cn } from "@/helpers"

export function Pricy({ price = 0, btnEnabled = true, mode, onBtnClick, isActive = false }) {
  const isBuy = mode === "buy"
  const modeText = isBuy ? "خرید" : "فروش"

  const priceClass = cn(
    "font-black text-center text-xl",
    isBuy ? "text-jadedark-11" : "text-reddark-11",
  )

  return (
    <div className="flex flex-col gap-1 grow shrink">
      <p className="text-[10px] text-center">قیمت {modeText} (ریال):</p>
      <p dir="ltr" className={priceClass}>
        {Number(price).toLocaleString()}
      </p>
      <Btn
        className="h-6 px-2 text-xs"
        disabled={!btnEnabled}
        themeType={isActive ? "filled" : "outline"}
        theme={isBuy ? "success" : "error"}
        onClick={onBtnClick}
      >
        {modeText}
      </Btn>
    </div>
  )
}
