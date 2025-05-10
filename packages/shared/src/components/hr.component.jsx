import * as RadixSeparator from "@radix-ui/react-separator"
import { cn } from "../helpers"

export const Hr = ({ className = "", ...delegated }) => (
  <RadixSeparator.Root
    className={cn("border-none h-0.5 w-20 bg-slatedark-6 mx-auto", className)}
    {...delegated}
  />
)
