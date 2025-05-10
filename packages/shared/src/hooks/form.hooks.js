import { useEffect, useState } from "react"
import { priceToToman } from "../utils"

function usePriceInput({ name, defaultValue, defaultPrice, required, label, ...other }) {
  const [price, setPrice] = useState(defaultValue)

  const props = {
    price,
    setPrice,
    name,
    required,
    toman: `${priceToToman(defaultPrice || price)} تومان`,
    label: `${label}${required ? " *" : ":"}`,
    ...other,
  }

  return { props, price, setPrice }
}

function useNormalInput({ name, label, required = false, defaultValue, ...other }) {
  const [value, setValue] = useState(defaultValue)
  const finalLabel = `${label}${required ? " *" : ":"}`
  const changeHandler = e => setValue(e.target.value)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  const props = {
    value,
    onChange: e => {
      if (other.type === "number") {
        if (e.target.value < 0 || e.target.value.includes("-")) {
          e.preventDefault()
          return
        }
      }
      changeHandler(e)
    },
    name,
    defaultValue,
    min: other.type === "number" ? 0 : undefined,
    required,
    label: finalLabel,
    ...other,
  }

  return { props, value, setValue }
}

function useFileInput({ name, label, required = false, ...other }) {
  const [files, setFiles] = useState([])
  const finalLabel = `${label}${required ? " *" : ":"}`
  const changeHandler = e => setFiles(e.target.files)

  const props = {
    onChange: changeHandler,
    name,
    files,
    label: finalLabel,
    ...other,
  }

  return { props, files }
}

export { useNormalInput, usePriceInput, useFileInput }
