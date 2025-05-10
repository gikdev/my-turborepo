import { Btn, LabeledInput } from "@/components"
import { useInEveryPage, useNormalInput, useSearchQuery } from "@/hooks"
import { HeadingLine } from "@/layouts"
import { ArrowRight, PenNibStraight, PlusMinus } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import tw from "tailwind-styled-components"
import { Link } from "wouter"
import { editGroup, getGroup, newGroup } from "../groups-gram.services"

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
  const [diffBuyPrice, setDiffBuyPrice] = useState(0)
  const [diffSellPrice, setDiffSellPrice] = useState(0)
  const isEditMode = isThereParam("id")
  const id = getParam("id") ?? 0

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

  useEffect(() => {
    if (isEditMode) getGroup(id, data => setDefaultData(data))
  }, [id, isEditMode])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isEditMode) return

    // if Nan -> 0, if undefined -> null, otherwise data...
    function validate(data) {
      let validated

      if (Number.isNaN(data)) validated = 0
      else if (data === undefined) validated = ""
      else validated = data

      return validated
    }

    name.setValue(validate(defaultData.name))
    description.setValue(validate(defaultData.description))
    setDiffBuyPrice(defaultData.diffBuyPrice)
    setDiffSellPrice(defaultData.diffSellPrice)
  }, [defaultData])

  function handleFormSubmission(e) {
    setLoading(true)
    e.preventDefault()

    const data = {
      id: Number(id),
      name: name.value,
      description: description.value,
      diffBuyPrice,
      diffSellPrice,
    }

    if (!isEditMode)
      newGroup(data, () => {
        setTimeout(() => location.assign("/groups-gram"), 3000)
      })

    if (isEditMode)
      editGroup(id, data, () => {
        setTimeout(() => location.assign("/groups-gram"), 3000)
      })
  }

  const handlePlusMinus = setter => () => setter(c => (c === 0 ? 0 : -c))

  return (
    <HeadingLine title={isEditMode ? "ویرایش گروه گرمی" : "ایجاد گروه گرمی"}>
      <StyledContainer onSubmit={handleFormSubmission}>
        <LabeledInput {...name.props} />
        <LabeledInput {...description.props} />

        <div className="flex items-end gap-1">
          <LabeledInput
            label="اختلاف خرید مشتری (ریال) *"
            type="number"
            containerClasses="w-full"
            required
            value={diffBuyPrice}
            onChange={e => setDiffBuyPrice(Number(e.target.value))}
            labelTextSecondary={
              <span className="flex gap-1">
                <span>تومان</span>
                <span dir="ltr">{Number(diffBuyPrice / 10).toLocaleString()}</span>
              </span>
            }
          >
            <Btn type="button" className="w-12 h-12" onClick={handlePlusMinus(setDiffBuyPrice)}>
              <PlusMinus size={24} />
            </Btn>
          </LabeledInput>
        </div>

        <div className="flex items-end gap-1">
          <LabeledInput
            label="اختلاف فروش مشتری (ریال) *"
            type="number"
            containerClasses="w-full"
            required
            value={diffSellPrice}
            onChange={e => setDiffSellPrice(Number(e.target.value))}
            labelTextSecondary={
              <span className="flex gap-1">
                <span>تومان</span>
                <span dir="ltr">{Number(diffSellPrice / 10).toLocaleString()}</span>
              </span>
            }
          >
            <Btn type="button" className="w-12 h-12" onClick={handlePlusMinus(setDiffSellPrice)}>
              <PlusMinus size={24} />
            </Btn>
          </LabeledInput>
        </div>

        <Btn
          isLoading={isLoading}
          disabled={isLoading}
          as={isLoading ? "button" : Link}
          href="/groups-gram"
          icon={ArrowRight}
        >
          برگشت به مدیریت گروه‌ها
        </Btn>
        <Btn type="submit" theme="primary" themeType="filled" icon={PenNibStraight}>
          {isEditMode ? "ویرایش" : "ایجاد"} گروه
        </Btn>
      </StyledContainer>
    </HeadingLine>
  )
}
