import { Upload } from "@phosphor-icons/react"
import { forwardRef } from "react"
import { Btn } from "."

function LabeledUploadInputComponent({ label, error, secondLabel, files, ...other }, ref) {
  const hasFile = !!files?.length

  return (
    <label className="flex flex-col gap-2">
      <span className="flex justify-between items-center">
        <span>{label}</span>
        {secondLabel}
      </span>
      <Btn as="span" className="h-12 cursor-pointer" icon={Upload}>
        {hasFile ? "تغییر" : "آپلود"} فایل
      </Btn>
      <input type="file" className="hidden" ref={ref} {...other} />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </label>
  )
}

export const LabeledUploadInput = forwardRef(LabeledUploadInputComponent)
