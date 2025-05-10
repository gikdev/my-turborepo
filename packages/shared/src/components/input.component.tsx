import styled from "@master/styled.react"
import { forwardRef } from "react"
import type { InputHTMLAttributes } from "react"

const StyledInput = styled.input`
  px-4 py-3 bg-slatedark-3 border border-slatedark-6 rounded text-slatedark-11 w-full
  focus:border-transparent focus:bg-slatedark-5 focus:text-slatedark-12
`

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <StyledInput className={className} ref={ref as unknown as React.LegacyRef<"input">} {...props} />
))
