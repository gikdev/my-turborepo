import { Btn, LabeledInput, LabeledSelect, LabeledUploadInput } from "@/components"
import { uploadFile } from "@/helpers"
import { useFileInput, useInEveryPage, useNormalInput, useSearchQuery } from "@/hooks"
import { HeadingLine } from "@/layouts"
import { ArrowRight, PenNibStraight } from "@phosphor-icons/react"
import Cookies from "js-cookie"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"
import tw from "tailwind-styled-components"
import { Link } from "wouter"
import * as customerServices from "../customer.services"

const StyledContainer = tw.form`
  grid sm:grid-cols-2 gap-y-6 gap-x-4 items-end
  bg-slatedark-2 border-2 border-slatedark-6 w-full mx-auto
  px-4 py-8 text-center rounded-lg max-w-[40rem]
`

export function Manage() {
  useInEveryPage()
  const groups = customerServices.useGetAllGroups()
  const groupsInt = customerServices.useGetAllGroupsInt()
  const [defaultData, setDefaultData] = useState({})
  const [getParam, isThereParam] = useSearchQuery()
  const [isLoading, setLoading] = useState(false)
  const isEditMode = isThereParam("id")
  const id = getParam("id") ?? 0

  const displayName = useNormalInput({
    name: "displayName",
    label: "نام کامل",
    required: true,
    defaultValue: "",
    dir: "rtl",
  })
  const mobile = useNormalInput({
    name: "mobile",
    label: "تلفن",
    required: true,
    defaultValue: "",
    dir: "ltr",
    type: "number",
  })
  const codeMelli = useNormalInput({
    name: "codeMelli",
    label: "کد ملی",
    defaultValue: "",
    dir: "ltr",
    type: "number",
  })
  const address = useNormalInput({
    name: "address",
    label: "آدرس",
    defaultValue: "",
    dir: "rtl",
  })
  const city = useNormalInput({
    name: "city",
    label: "شهر",
    defaultValue: "",
    dir: "rtl",
  })
  const selectedGroup = useNormalInput({
    name: "selectedGroup",
    label: "گروه مشتری گرمی",
    required: !!groups?.length,
    options: [...groups],
    defaultValue: defaultData.groupID,
  })
  const selectedGroupInt = useNormalInput({
    name: "selectedGroupInt",
    label: "گروه مشتری عددی",
    required: !!groupsInt?.length,
    options: [...groupsInt],
    defaultValue: defaultData.groupIntID,
  })
  const melliFile = useFileInput({
    name: "melliFile",
    label: "آیدی ملی",
  })
  const kasbsFile = useFileInput({
    name: "kasbsFile",
    label: "جواز کسب",
  })
  const isActive = useNormalInput({
    name: "isActive",
    label: "آیا فعال هست؟",
    required: true,
    defaultValue: 1,
    options: [
      { value: 0, name: "خیر" },
      { value: 1, name: "بلی" },
    ],
  })
  const isBlocked = useNormalInput({
    name: "isBlocked",
    label: "مسدود کردن انجام معامله؟",
    required: true,
    defaultValue: 0,
    options: [
      { value: 0, name: "خیر" },
      { value: 1, name: "بلی" },
    ],
  })
  const password = useNormalInput({
    name: "password",
    label: "رمز",
    defaultValue: "",
    type: "password",
    required: !isEditMode,
  })
  const passwordRepeat = useNormalInput({
    name: "passwordRepeat",
    label: "تکرار رمز",
    defaultValue: "",
    type: "password",
    required: !isEditMode,
  })
  const allowedDevices = useNormalInput({
    type: "number",
    label: "تعداد دستگاه‌های هم‌زمان مجاز",
    min: 1,
    max: 10,
    name: "allowedDevices",
    defaultValue: 1,
    required: true,
  })

  useEffect(() => {
    if (isEditMode) customerServices.$get(id, data => setDefaultData(data))
  }, [id, isEditMode])

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
    if (!isEditMode) return

    // if Nan -> 0, if undefined -> null, otherwise data...
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
    isActive.setValue(Number(validate(defaultData.isActive)))
    isBlocked.setValue(Number(validate(defaultData.isBlocked)))
    allowedDevices.setValue(defaultData.allowedDevices)
  }, [defaultData])

  function handleFormSubmission(e) {
    setLoading(true)
    e.preventDefault()

    let melliID = null
    let kasbsID = null

    console.log({
      gv: selectedGroup.props.value,
      gd: selectedGroup.props.defaultValue,
      iv: selectedGroupInt.props.value,
      id: selectedGroupInt.props.defaultValue,
    })

    if (!["string", "number"].includes(typeof selectedGroup.props.value))
      if (!["string", "number"].includes(typeof selectedGroup.props.defaultValue))
        return void toast.error("لطفا گروه مشتری گرمی رو هم انتخاب کنید")
    if (!["string", "number"].includes(typeof selectedGroupInt.props.value))
      if (!["string", "number"].includes(typeof selectedGroupInt.props.defaultValue))
        return void toast.error("لطفا گروه مشتری عددی رو هم انتخاب کنید")

    // Step by step
    Promise.resolve()
      .then(() => (melliFile.files.length ? uploadFile(melliFile.files[0], true) : null))
      .then(GUID => {
        melliID = GUID ?? null
      })
      .then(() => (kasbsFile.files.length ? uploadFile(kasbsFile.files[0], true) : null))
      .then(GUID => {
        kasbsID = GUID ?? null
      })
      .then(() => {
        const data = {
          id: Number(id),
          masterID: Number(Cookies.get("masterID")),
          displayName: displayName.value,
          mobile: mobile.value,
          password: password.value,
          codeMelli: codeMelli.value,
          groupID: Number(selectedGroup.value),
          groupIntID: Number(selectedGroupInt.value) ? Number(selectedGroupInt.value) : null,
          address: address.value,
          city: city.value,
          diffPrice: 0,
          melliID,
          kasbsID,
          isActive: Boolean(Number(isActive.value)),
          isBlocked: Boolean(Number(isBlocked.value)),
          allowedDevices: Number(allowedDevices.value),
        }

        return data
      })
      .then(data => {
        if (isEditMode)
          customerServices.$edit(data, () => {
            setTimeout(() => location.assign("/customers"), 3000)
          })
        if (!isEditMode)
          customerServices.$new(data, () => {
            setTimeout(() => location.assign("/customers"), 3000)
          })
      })
  }

  return (
    <HeadingLine title={isEditMode ? "ویرایش کاربر" : "ایجاد کاربر"}>
      <StyledContainer onSubmit={handleFormSubmission}>
        <LabeledInput {...displayName.props} />
        <LabeledInput {...mobile.props} />
        <LabeledInput {...codeMelli.props} />
        <LabeledInput {...address.props} />
        <LabeledInput {...city.props} />
        <LabeledInput {...allowedDevices.props} />
        {!!groups?.length && <LabeledSelect {...selectedGroup.props} />}
        {!!groupsInt?.length && <LabeledSelect {...selectedGroupInt.props} />}
        <LabeledUploadInput {...melliFile.props} />
        <LabeledUploadInput {...kasbsFile.props} />
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
        >
          برگشت به مدیریت کاربران
        </Btn>
        <Btn type="submit" theme="primary" themeType="filled" icon={PenNibStraight}>
          {isEditMode ? "ویرایش" : "ایجاد"} کاربر
        </Btn>
      </StyledContainer>
    </HeadingLine>
  )
}
