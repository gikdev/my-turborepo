import { forwardRef, useEffect, useMemo } from "react"
import { Input } from "."
import { priceToRial, rialToPrice } from "../utils"

function PriceInputComponent(
  { title, price, setPrice, defaultPrice, allowNegative, ...rest },
  ref,
) {
  const allowedKeys = useMemo(
    () => [
      "۰",
      "۱",
      "۲",
      "۳",
      "۴",
      "۵",
      "۶",
      "۷",
      "۸",
      "۹",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "ArrowLeft",
      "ArrowUp",
      "ArrowDown",
      "ArrowRight",
      "Delete",
      "Backspace",
      "Tab",
      "Escape",
      "Enter",
      "Control",
      "Alt",
      "Shift",
      "Meta",
      ...(allowNegative ? [] : ["-"]),
    ],
    [allowNegative],
  )
  const handlePriceInput = e => setPrice(rialToPrice(e.target.value))

  function handleKeyPress(e) {
    const isPressingAllowedKey = allowedKeys.includes(e.key)
    if (!isPressingAllowedKey) e.preventDefault()
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (defaultPrice) setPrice(priceToRial(Number(defaultPrice)))
  }, [])

  return (
    <Input
      type="text"
      dir="ltr"
      value={Number(price).toLocaleString()}
      onChange={handlePriceInput}
      onKeyDown={handleKeyPress}
      defaultValue={priceToRial(defaultPrice)}
      {...rest}
      ref={ref}
    />
  )
}

export const PriceInput = forwardRef(PriceInputComponent)
