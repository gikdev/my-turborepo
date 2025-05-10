import { forwardRef, useId } from "react"
import { Input } from "."
import { cn } from "../helpers"

function LabeledInputComponent(
  { label, containerClasses, labelClassName, children, labelTextSecondary = "", ...delegated },
  ref,
) {
  const idToUse = useId()
  const id = `labeled-input-${idToUse}`
  const containerClassName = cn("flex flex-col gap-2", containerClasses)

  return (
    <div className={containerClassName}>
      <label htmlFor={id} className="flex justify-between items-center">
        <span className={labelClassName}>{label}</span>
        <span className="text-xs">{labelTextSecondary}</span>
      </label>
      <div className="flex gap-1">
        <Input dir="ltr" id={id} {...delegated} ref={ref} />
        {children}
      </div>
    </div>
  )
}

export const LabeledInput = forwardRef(LabeledInputComponent)
