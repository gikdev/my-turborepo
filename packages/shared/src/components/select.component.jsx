import { forwardRef } from "react"
import tw from "tailwind-styled-components"

const StyledSelect = tw.select`
  px-4 py-3 bg-slatedark-3 border border-slatedark-6 rounded text-slatedark-11
  focus:border-transparent focus:bg-slatedark-5 focus:text-slatedark-12
`

function SelectComponent({ className, ...other }, ref) {
  return <StyledSelect className={className} ref={ref} {...other} />
}

const Select = forwardRef(SelectComponent)

export { Select }
