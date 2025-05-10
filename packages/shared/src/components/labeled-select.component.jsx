import { forwardRef } from "react"
import { Labeler, Select } from "."

function LabeledSelectComponent({ options, label, error, ...other }, ref) {
  return (
    <Labeler label1={label} error={error}>
      <Select {...other} ref={ref}>
        <option value="" disabled selected>
          انتخاب کنید
        </option>

        {options?.map(({ id, value, name, ...others }, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <option key={i} value={typeof id === "number" || !!id ? id : value} {...others}>
            {name}
          </option>
        ))}
      </Select>
    </Labeler>
  )
}

export const LabeledSelect = forwardRef(LabeledSelectComponent)
