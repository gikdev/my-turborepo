import styled from "@master/styled.react"
import {
  type ForwardRefExoticComponent,
  type RefAttributes,
  type TextareaHTMLAttributes,
  forwardRef,
} from "react"

const StyledTextarea = styled.textarea`
  px-4 py-3 bg-slatedark-3 border border-slatedark-6 rounded text-slatedark-11 w-full
  min-h-10 focus:border-transparent focus:bg-slatedark-5 focus:text-slatedark-12
` as ForwardRefExoticComponent<
  TextareaHTMLAttributes<HTMLTextAreaElement> & RefAttributes<HTMLTextAreaElement>
>

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, ...delegated }, ref) => (
    <StyledTextarea className={className} {...delegated} ref={ref} />
  ),
)
