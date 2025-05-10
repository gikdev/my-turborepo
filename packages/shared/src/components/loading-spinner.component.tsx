import { type IconProps, SpinnerGap } from "@phosphor-icons/react"
import { cn } from "../helpers"

interface LoadingSpinnerProps extends IconProps {
  className?: string
}

export function LoadingSpinner({ className, ...other }: LoadingSpinnerProps) {
  const finalClass = cn("animate-spin", className)

  return (
    <span className="text-inherit">
      <SpinnerGap size={24} className={finalClass} {...other} />
    </span>
  )
}
