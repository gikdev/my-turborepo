import { Btn, LabeledInput, LabeledPriceInput, LabeledSelect, ShowMoreBtn } from "@/components"
import { apiEndpoints, apiHelper, fetcher } from "@/helpers"
import { useInEveryPage, useNormalInput, usePriceInput, useSearchQuery } from "@/hooks"
import { HeadingLine } from "@/layouts"
import { toISOStr } from "@/utils"
import { ArrowRight, CaretDoubleDown, CaretDoubleUp, PenNibStraight } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import useSWR from "swr"
import tw from "tailwind-styled-components"
import { Link } from "wouter"
import { editProduct, getProduct, newProduct } from "../product.services"

const StyledContainer = tw.form`
  grid sm:grid-cols-2 gap-y-6 gap-x-4 items-end
  bg-slatedark-2 border-2 border-slatedark-6 w-full mx-auto
  px-4 py-8 text-center rounded-lg max-w-[40rem]
`

export function Manage() {
  useInEveryPage()
  const [defaultData, setDefaultData] = useState({})
  const [isShowMoreDetail, setIsShowMoreDetail] = useState(false)
  const [getParam, isThereParam] = useSearchQuery()
  const [isLoading, setLoading] = useState(false)
  const [priceSources, setPriceSources] = useState([])
  const [isUseOne, setIsUseOne] = useState(false)
  const isEditMode = isThereParam("id")
  const id = getParam("id")

  const config = apiEndpoints.stockPriceSource.getPriceSources
  const response = useSWR(config.url, fetcher({ headers: apiHelper.header.bearer }))

  useEffect(() => {
    setPriceSources(response.data ?? [])
  }, [response.data])

  const name = useNormalInput({
    name: "name",
    label: "نام",
    required: true,
    defaultValue: "",
    dir: "rtl",
  })
  const description = useNormalInput({
    name: "description",
    label: "توضیح",
    required: false,
    defaultValue: "",
    dir: "rtl",
  })
  const price = usePriceInput({
    name: "price",
    defaultValue: 0,
    required: true,
    label: "قیمت",
  })
  const priceStep = usePriceInput({
    name: "priceStep",
    defaultValue: 0,
    required: true,
    label: "استپ قیمت",
  })
  const diffPriceStep = usePriceInput({
    name: "diffPriceStep",
    defaultValue: 0,
    required: true,
    label: "استپ اختلاف قیمت",
  })
  const minValue = usePriceInput({
    name: "minValue",
    defaultValue: 0,
    required: true,
    label: "حداقل ارزش محصول",
  })
  const maxValue = usePriceInput({
    name: "maxValue",
    defaultValue: 0,
    required: true,
    label: "حداکثر ارزش محصول",
  })
  const diffBuyPrice = usePriceInput({
    name: "diffBuyPrice",
    defaultValue: 0,
    required: true,
    label: "اختلاف خرید مشتری",
  })
  const diffSellPrice = useNormalInput({
    name: "diffSellPrice",
    required: true,
    label: "اختلاف فروش مشتری",
    defaultPrice: isEditMode ? null : diffBuyPrice.price,
    type: "number",
  })
  const minVolume = useNormalInput({
    name: "minVolume",
    label: "حداقل حجم معامله (گرم)",
    required: true,
    defaultValue: 0,
  })
  const maxVolume = useNormalInput({
    name: "maxVolume",
    label: "حداکثر حجم معامله (گرم)",
    required: true,
    defaultValue: 0,
  })
  const unit = useNormalInput({
    name: "unit",
    label: "نحوه معامله",
    required: true,
    defaultValue: 0,
    options: [
      { id: 0, name: "گرمی" },
      { id: 1, name: "تعدادی" },
      { id: 2, name: "مثقالی" },
    ],
  })
  const unitPriceRatio = useNormalInput({
    name: "unitPriceRatio",
    label: "نسبت قیمت اعلام شده به گرم",
    required: true,
    // defaultValue: isCountable?.value == 2 ? 0.3318 : 1,
    type: "number",
    step: "0.00001",
  })
  const decimalNumber = useNormalInput({
    name: "decimalNumber",
    label: "تعداد اعشار در محاسبه",
    required: true,
    defaultValue: 2,
    type: "number",
  })
  const maxAutoMin = useNormalInput({
    name: "maxAutoMin",
    label: "حداکثر زمان خودکار (دقیقه)",
    required: true,
    defaultValue: 0.5,
    type: "number",
    step: "0.00001",
  })
  const mode = useNormalInput({
    name: "mode",
    label: "نوع معامله",
    required: true,
    defaultValue: 2,
    options: [
      { value: 0, name: "عادی" },
      { value: 1, name: "تایید خودکار" },
      { value: 2, name: "رد خودکار" },
    ],
  })
  const status = useNormalInput({
    name: "status",
    label: "وضعیت خرید و فروش",
    required: true,
    defaultValue: 3,
    options: [
      { id: 0, name: "غیر فعال" },
      { id: 1, name: "قابل خرید توسط مشتری" },
      { id: 2, name: "قابل فروش توسط مشتری" },
      { id: 3, name: "قابل خرید و فروش" },
    ],
  })
  const supply = useNormalInput({
    name: "supply",
    label: "مقدار موجود",
    required: true,
    defaultValue: 0,
    type: "number",
  })
  const priceSourceID = useNormalInput({
    name: "priceSource",
    label: "قیمت منبع",
    options:
      priceSources !== undefined || priceSources != null
        ? [
            { value: undefined, name: undefined },
            ...priceSources.map(i => ({
              value: i.id,
              name: `${i.code} - ${i.name}`,
            })),
          ]
        : [],
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isEditMode) return

    const id = getParam("id")
    getProduct(id, data => setDefaultData(data))
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // biome-ignore lint/suspicious/noDoubleEquals: <explanation>
    unitPriceRatio.setValue(unit?.value == 2 ? Number(4.3318) : Number(1))
  }, [unit])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isEditMode) return

    // if Nan -> 0, if undefined -> null, otherwise data...
    const toSimulated = data => {
      let toSet
      if (Number.isNaN(data)) toSet = 0
      else if (data === undefined) toSet = ""
      else toSet = data

      return toSet
    }

    name.setValue(toSimulated(defaultData.name))
    description.setValue(toSimulated(defaultData.description))
    price.setPrice(defaultData.price)
    priceStep.setPrice(defaultData.priceStep)
    diffPriceStep.setPrice(defaultData.diffPriceStep)
    minValue.setPrice(defaultData.minValue)
    maxValue.setPrice(defaultData.maxValue)
    diffBuyPrice.setPrice(defaultData.diffBuyPrice)
    diffSellPrice.setValue(defaultData.diffSellPrice)
    minVolume.setValue(toSimulated(Number.parseFloat(defaultData.minVoume)))
    maxVolume.setValue(toSimulated(Number.parseFloat(defaultData.maxVoume)))
    unitPriceRatio.setValue(toSimulated(Number.parseFloat(defaultData.unitPriceRatio)))
    decimalNumber.setValue(toSimulated(Number.parseFloat(defaultData.decimalNumber)))
    maxAutoMin.setValue(toSimulated(Number.parseFloat(defaultData.maxAutoMin)))
    mode.setValue(toSimulated(Number(defaultData.mode)))
    status.setValue(toSimulated(Number(defaultData.status)))
    unit.setValue(toSimulated(defaultData.unit))
    supply.setValue(toSimulated(Number(defaultData.supply)))
    priceSourceID.setValue(toSimulated(defaultData.priceSourceID))
  }, [defaultData])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isUseOne) {
      diffSellPrice.setValue(diffBuyPrice.price)
    } else {
      setIsUseOne(true)
    }
  }, [diffBuyPrice.price])

  function handleFormSubmission(e) {
    setLoading(true)
    e.preventDefault()

    const data = {
      id: Number(id),
      name: name.value,
      description: description.value,

      price: price.price,
      priceStep: priceStep.price,
      diffPriceStep: diffPriceStep.price,
      minValue: minValue.price,
      maxValue: maxValue.price,
      diffBuyPrice: diffBuyPrice.price,
      diffSellPrice: Number(diffSellPrice.value),
      minVoume: Number(minVolume.value),
      maxVoume: Number(maxVolume.value),

      unitPriceRatio:
        // biome-ignore lint/suspicious/noDoubleEquals: <explanation>
        !unitPriceRatio.value && unitPriceRatio.value != 0
          ? // biome-ignore lint/suspicious/noDoubleEquals: <explanation>
            unit?.value == 2
            ? Number(4.3318)
            : 1
          : Number.parseFloat(unitPriceRatio.value),
      decimalNumber: Number.parseFloat(decimalNumber.value),
      maxAutoMin: Number.parseFloat(maxAutoMin.value),
      mode: Number(mode.value),
      status: Number(status.value),
      dateUpdate: toISOStr(new Date()),
      isCountable: false,
      unit: Number(unit.value),
      supply: Number(supply.value),
      priceSourceID: priceSourceID.value == null ? null : priceSourceID.value,
    }

    if (!isEditMode)
      newProduct(data, () => {
        setTimeout(() => location.assign("/products"), 1000)
      })

    if (isEditMode)
      editProduct(id, data, () => {
        setTimeout(() => location.assign("/products"), 1000)
      })
  }

  return (
    <HeadingLine title={isEditMode ? "ویرایش محصول" : "مدیریت محصول"}>
      <StyledContainer onSubmit={handleFormSubmission}>
        <LabeledInput {...name.props} />
        <LabeledInput {...description.props} />
        <LabeledPriceInput {...price.props} />
        <LabeledPriceInput {...priceStep.props} />
        <LabeledPriceInput {...diffPriceStep.props} />
        <LabeledPriceInput {...diffBuyPrice.props} />
        <LabeledPriceInput {...minVolume.props} />
        <LabeledPriceInput {...maxVolume.props} />
        <LabeledSelect {...status.props} />
        <LabeledSelect {...unit.props} />
        <LabeledSelect {...priceSourceID.props} />

        <ShowMoreBtn setState={setIsShowMoreDetail} state={isShowMoreDetail}>
          <div className="flex items-center gap-2 mb-4">
            {isShowMoreDetail ? (
              <>
                نمایش جزییات کمتر
                <CaretDoubleUp size={32} />
              </>
            ) : (
              <>
                نمایش جزییات بیشتر
                <CaretDoubleDown size={32} />
              </>
            )}
          </div>
        </ShowMoreBtn>
        {isShowMoreDetail && (
          <>
            <LabeledPriceInput {...minValue.props} />
            <LabeledPriceInput {...maxValue.props} />
            <LabeledInput
              hideLabel2
              {...diffSellPrice.props}
              defaultPrice={isEditMode ? null : diffBuyPrice.price}
            />
            <LabeledSelect {...mode.props} defaultValue={3} />
            <LabeledInput
              {...unitPriceRatio.props}
              // biome-ignore lint/suspicious/noDoubleEquals: <explanation>
              defaultValue={unit?.value == 2 ? Number(4.3318) : Number(1)}
            />
            <LabeledInput {...decimalNumber.props} />
            <LabeledInput {...maxAutoMin.props} />
            <LabeledInput {...supply.props} />
          </>
        )}
        <div />

        <div />

        <Btn
          isLoading={isLoading}
          disabled={isLoading}
          as={isLoading ? "button" : Link}
          href="/products"
          icon={ArrowRight}
        >
          برگشت به مدیریت محصولات
        </Btn>
        <Btn type="submit" theme="primary" themeType="filled" icon={PenNibStraight}>
          {isEditMode ? "ویرایش" : "ایجاد"} محصول
        </Btn>
      </StyledContainer>
    </HeadingLine>
  )
}
