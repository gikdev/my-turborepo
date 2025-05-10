import { forwardRef, useId } from "react"
import { Textarea } from "."

function LabeledTextareaComponent({ label, error, labelTextSecondary = "", ...delegated }, ref) {
  const idToUse = useId()
  const id = `labeled-textarea-${idToUse}`

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex justify-between items-center">
        <span>{label}</span>
        <span className="text-xs">{labelTextSecondary}</span>
      </label>
      <Textarea dir="ltr" id={id} {...delegated} ref={ref} />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  )
}

export const LabeledTextarea = forwardRef(LabeledTextareaComponent)
