import { Btn, LabeledInput, LabeledPriceInput } from "@/components"
import { useInEveryPage, useNormalInput, useSearchQuery } from "@/hooks"
import { HeadingLine } from "@/layouts"
import { ArrowRight, PenNibStraight } from "@phosphor-icons/react"
import { apiClient } from "@repo/shared/services/api-client"
import { useEffect, useState } from "react"
import tw from "tailwind-styled-components"
import { Link } from "wouter"
import { editPriceSource, newPriceSource } from "../price-source.service"

const StyledContainer = tw.form`
  grid sm:grid-cols-2 gap-y-6 gap-x-4 items-end
  bg-slatedark-2 border-2 border-slatedark-6 w-full mx-auto
  px-4 py-8 text-center rounded-lg max-w-[40rem]
`

export function Manage() {
  useInEveryPage()
  const [defaultData, setDefaultData] = useState({})
  const [getParam, isThereParam] = useSearchQuery()
  const [isLoading, setLoading] = useState(false)
  const isEditMode = isThereParam("id")
  const id = Number(getParam("id"))

  const res = apiClient.useFetch(() => ({
    endpoint: "/StockPriceSource/GetStockPriceSources",
  }))

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isEditMode) return

    setDefaultData(res.data?.find(el => el.id === id))
  }, [id, res.data])

  const name = useNormalInput({
    name: "name",
    label: "نام",
    required: true,
    defaultValue: "",
    dir: "rtl",
  })
  const sourceUrl = useNormalInput({
    name: "sourceUrl",
    label: "آدرس",
    required: true,
    defaultValue: "",
    dir: "ltr",
  })
  const price = useNormalInput({
    name: "price",
    label: "قیمت",
    required: true,
    defaultValue: 0,
  })
  const code = useNormalInput({
    name: "code",
    label: "کد",
    required: true,
    defaultValue: "",
    dir: "ltr",
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isEditMode)
      if (!isEditMode)
        // customerServices.getPriceSource(id, (data) => setDefaultData(data));
        return

    // if Nan -> 0, if undefined -> null, otherwise data...
    function validate(data) {
      let validated

      if (Number.isNaN(data)) validated = 0
      else if (data === undefined) validated = ""
      else validated = data

      return validated
    }

    name.setValue(validate(defaultData?.name))
    sourceUrl.setValue(validate(defaultData?.sourceUrl))
    code.setValue(validate(defaultData?.code))
    // price.setPrice(defaultData.diffSellPrice);
    price.setValue(validate(defaultData?.price))
    // price.setValue(validate(defaultData.price));
  }, [defaultData])

  function handleFormSubmission(e) {
    setLoading(true)
    e.preventDefault()

    // Step by step
    Promise.resolve()
      .then(() => {
        const data = {
          sourceUrl: sourceUrl.value,
          name: name.value,
          code: code.value,
          price: price.value,
        }
        return data
      })
      .then(data => {
        if (!isEditMode)
          newPriceSource(data, () => {
            console.log("DATA", data)

            setTimeout(() => location.assign("/price-sources"), 3000)
          })

        if (isEditMode)
          editPriceSource(id, data, () => {
            setTimeout(() => location.assign("/price-sources"), 3000)
          })
      })
  }

  return (
    <HeadingLine title={isEditMode ? "ویرایش منبع قیمت" : "ایجاد منبع قیمت"}>
      <StyledContainer onSubmit={handleFormSubmission}>
        <LabeledInput {...name.props} />
        <LabeledInput {...sourceUrl.props} />
        <LabeledInput {...code.props} />
        <LabeledPriceInput {...price.props} />
        <Btn
          isLoading={isLoading}
          disabled={isLoading}
          as={isLoading ? "button" : Link}
          href="/price-sources"
          icon={ArrowRight}
        >
          برگشت به مدیریت منابع قیمت
        </Btn>
        <Btn type="submit" theme="primary" themeType="filled" icon={PenNibStraight}>
          {isEditMode ? "ویرایش" : "ایجاد"} منبع قیمت
        </Btn>
      </StyledContainer>
    </HeadingLine>
  )
}
