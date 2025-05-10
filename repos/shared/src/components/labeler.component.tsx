import type { LabelHTMLAttributes, ReactNode } from "react"

interface LabelerProps extends LabelHTMLAttributes<HTMLLabelElement> {
  label1?: ReactNode
  label1ClassName?: string
  label2?: ReactNode
  children: ReactNode
  error?: string
}

export function Labeler({
  label1,
  label1ClassName,
  label2,
  children,
  error,
  ...others
}: LabelerProps) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: label wraps input element
    <label className="flex flex-col gap-2" {...others}>
      <span className="flex justify-between items-center">
        <span className={label1ClassName}>{label1}</span>
        <span className="text-xs">{label2}</span>
      </span>
      {children}
      {error && <span className="text-xs text-reddark-10">{error}</span>}
    </label>
  )
}
