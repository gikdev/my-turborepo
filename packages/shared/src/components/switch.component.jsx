import * as RadixSwitch from "@radix-ui/react-switch"
import { forwardRef } from "react"
import { cn } from "../helpers"

function SwitchComponent({ checked, customCheckedColor, customUnCheckedColor, ...delegated }, ref) {
  const rootStyles = cn(
    "w-12 transition-all h-7 flex p-1 items-center rounded",
    checked
      ? customCheckedColor
        ? customCheckedColor
        : "bg-amberdark-9"
      : customUnCheckedColor
        ? customUnCheckedColor
        : "bg-slatedark-6",
    checked ? "justify-end" : "justify-start",
  )
  const thumbStyles = cn("size-5 bg-slatedark-12 inline-block rounded shadow-lg")

  return (
    <RadixSwitch.Root checked={checked} className={rootStyles} {...delegated} ref={ref}>
      <RadixSwitch.Thumb className={thumbStyles} />
    </RadixSwitch.Root>
  )
}

export const Switch = forwardRef(SwitchComponent)
