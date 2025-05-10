import { LoadingSpinner } from "."
import { cn } from "../helpers"

const styles = {
  base: `
    rounded h-10 px-4 active:scale-90 transition-all 
    flex items-center justify-center gap-2 disabled:bg-slatedark-3 
    disabled:text-slatedark-11 disabled:opacity-50
    disabled:active:scale-100 disabled:cursor-not-allowed
  `,
  filled: {
    success: "bg-jadedark-10 text-jadedark-1",
    error: "bg-reddark-10 text-reddark-1",
    warning: "bg-yellowdark-10 text-yellowdark-1",
    info: "bg-bluedark-10 text-bluedark-1",
    primary: "bg-amberdark-9 text-amberdark-1",
    neutral: "bg-slatedark-12 text-slatedark-1",
  },
  outline: {
    success: "bg-jadedark-3 text-jadedark-11",
    error: "bg-reddark-3 text-reddark-11",
    warning: "bg-yellowdark-3 text-yellowdark-11",
    info: "bg-bluedark-3 text-bluedark-11",
    primary: "bg-amberdark-3 text-amberdark-11",
    neutral: "bg-slatedark-3 text-slatedark-11",
  },
}

export function Btn({
  as: Tag = "button",
  icon: Icon = null,
  className = "",
  isLoading = false,
  themeType = "outline",
  theme = "neutral",
  children = null,
  ...delegated
}) {
  return (
    <Tag
      disabled={isLoading}
      className={cn(styles.base, styles[themeType][theme], className)}
      {...delegated}
    >
      {!!Icon && <Icon size={24} />}
      {children && <span>{children}</span>}
      {isLoading && <LoadingSpinner />}
    </Tag>
  )
}
