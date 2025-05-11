//@ts-check
import { Btn, LabeledInput, LabeledSelect, Labeler } from "@/components"
import { useGUIDLink, useInEveryPage, useNormalInput } from "@/hooks"
import { HeadingLine } from "@/layouts"
import { ArrowRight } from "@phosphor-icons/react"
import { Download } from "@phosphor-icons/react/dist/ssr"
import { useCallback, useEffect, useState } from "react"
import tw from "tailwind-styled-components"
import { Link, useParams } from "wouter"
import * as customerServices from "./customer.services"

const StyledContainer = tw.div`
  grid sm:grid-cols-2 gap-y-6 gap-x-4 items-end
  bg-slatedark-2 border-2 border-slatedark-6 w-full mx-auto
  px-4 py-8 text-center rounded-lg max-w-[40rem]
`

export function CustomerId() {
  useInEveryPage()
  const groups = customerServices.useGetAllGroups()
  const groupsInt = customerServices.useGetAllGroupsInt()
  const [defaultData, setDefaultData] = useState({})
  const [isLoading, setLoading] = useState(false)
  const { id } = useParams()

  const displayName = useNormalInput({
    name: "displayName",
    label: "نام کامل",
    required: true,
    defaultValue: "",
    dir: "rtl",
    readOnly: true,
  })
  const mobile = useNormalInput({
    name: "mobile",
    label: "تلفن",
    required: true,
    defaultValue: "",
    dir: "ltr",
    type: "number",
    readOnly: true,
  })
  const codeMelli = useNormalInput({
    name: "codeMelli",
    label: "کد ملی",
    defaultValue: "",
    dir: "ltr",
    type: "number",
    readOnly: true,
  })
  const address = useNormalInput({
    name: "address",
    label: "آدرس",
    defaultValue: "",
    readOnly: true,
    dir: "rtl",
  })
  const city = useNormalInput({
    name: "city",
    label: "شهر",
    defaultValue: "",
    readOnly: true,
    dir: "rtl",
  })
  const selectedGroup = useNormalInput({
    name: "selectedGroup",
    disabled: true,
    label: "گروه مشتری",
    required: !!groupsInt?.length,
    options:
      defaultData?.groupID && groups?.length
        ? [groups.find(g => g.id === defaultData?.groupID)]
        : [{ name: "-", value: null }],
  })
  const selectedGroupInt = useNormalInput({
    name: "selectedGroupInt",
    disabled: true,
    label: "گروه مشتری عددی",
    required: !!groupsInt?.length,
    options:
      defaultData?.groupIntID && groupsInt?.length
        ? [groupsInt.find(g => g.id === defaultData?.groupIntID)]
        : [{ name: "-", value: null }],
  })
  const isActive = useNormalInput({
    name: "isActive",
    label: "آیا فعال هست؟",
    required: true,
    defaultValue: 1,
    disabled: true,
    readOnly: true,
    options: [
      { value: false, name: "خیر" },
      { value: true, name: "بلی" },
    ],
  })
  const isBlocked = useNormalInput({
    name: "isBlocked",
    label: "مسدود کردن انجام معامله؟",
    required: true,
    disabled: true,
    defaultValue: 0,
    readOnly: true,
    options: [
      { value: false, name: "خیر" },
      { value: true, name: "بلی" },
    ],
  })
  const password = useNormalInput({
    name: "password",
    label: "رمز",
    defaultValue: "",
    readOnly: true,
    type: "password",
  })
  const passwordRepeat = useNormalInput({
    name: "passwordRepeat",
    label: "تکرار رمز",
    readOnly: true,
    defaultValue: "",
    type: "password",
  })
  const allowedDevices = useNormalInput({
    type: "number",
    label: "تعداد دستگاه‌های هم‌زمان مجاز",
    min: 1,
    readOnly: true,
    max: 10,
    name: "allowedDevices",
    defaultValue: 1,
    required: true,
  })

  useEffect(() => {
    if (typeof id !== "number") return
    customerServices.$get(id, data => setDefaultData(data))
  }, [id])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useCallback(() => {
    selectedGroup.setValue(groups?.[0]?.id)
  }, [groups])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useCallback(() => {
    selectedGroupInt.setValue(groupsInt?.[0]?.id)
  }, [groupsInt])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!defaultData) return

    function validate(data) {
      let validated

      if (Number.isNaN(data)) validated = 0
      else if (data === undefined) validated = ""
      else validated = data

      return validated
    }

    displayName.setValue(validate(defaultData.displayName))
    mobile.setValue(validate(defaultData.mobile))
    codeMelli.setValue(validate(defaultData.codeMelli))
    address.setValue(validate(defaultData.address))
    city.setValue(validate(defaultData.city))
    selectedGroup.setValue(validate(defaultData.groupID))
    isActive.setValue(validate(defaultData.isActive))
    isBlocked.setValue(validate(defaultData.isBlocked))
    allowedDevices.setValue(defaultData.allowedDevices)
  }, [defaultData])

  return (
    <HeadingLine title="جزییات کاربر">
      <StyledContainer>
        <LabeledInput {...displayName.props} />
        <LabeledInput {...mobile.props} />
        <LabeledInput {...codeMelli.props} />
        <LabeledInput {...address.props} />
        <LabeledInput {...city.props} />
        <LabeledInput {...allowedDevices.props} />
        <LabeledSelect {...selectedGroup.props} />
        <LabeledSelect {...selectedGroupInt.props} />
        <LabeledDLBtn label="آیدی ملی:" guid={defaultData?.melliID} />
        <LabeledDLBtn label="آیدی کسب:" guid={defaultData?.kasbsID} />
        <LabeledSelect {...isActive.props} />
        <LabeledSelect {...isBlocked.props} />
        <LabeledInput {...password.props} />
        <LabeledInput {...passwordRepeat.props} />

        <Btn
          isLoading={isLoading}
          disabled={isLoading}
          as={isLoading ? "button" : Link}
          href="/customers"
          icon={ArrowRight}
          className="w-full"
        >
          برگشت به مدیریت کاربران
        </Btn>
        <div />
      </StyledContainer>
    </HeadingLine>
  )
}

function LabeledDLBtn({ label, guid }) {
  const url = useGUIDLink(guid)

  return (
    <Labeler label1={label}>
      {url ? (
        <Btn as="a" href={url} download rel="noopener noreferrer">
          <div className="flex gap-2">
            <Download size={24} />
            <span>دانلود فایل</span>
          </div>
        </Btn>
      ) : (
        <Btn disabled>فایلی ندارد</Btn>
      )}
    </Labeler>
  )
}
