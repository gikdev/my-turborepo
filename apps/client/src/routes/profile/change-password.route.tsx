import { Btn, LabeledInput } from "@/components"
import { useNormalInput } from "@/hooks"
import { HeadingLine } from "@/layouts"
import { PenNibStraight } from "@phosphor-icons/react"
import { apiClient } from "vgold-shared/services/api-client"
import { sha512 } from "js-sha512"
import { type FormEvent, useState } from "react"
import { toast } from "react-toastify"
import tw from "tailwind-styled-components"

const StyledContainer = tw.form`
  grid sm:grid-cols-2 gap-y-6 gap-x-4 items-end
  bg-slatedark-2 border-2 border-slatedark-6 w-full mx-auto
  px-4 py-8 text-center rounded-lg max-w-[40rem]
`

const isEmpty = <T extends string | null | undefined>(val: T): boolean =>
  [undefined, null, ""].includes(val)

export function ChangePassword() {
  const [isLoading, setLoading] = useState(false)
  const oldPw = useNormalInput({
    type: "password",
    required: true,
    dir: "ltr",
    defaultValue: "",
    name: "oldPw",
    label: "رمز فعلی",
  })
  const newPw = useNormalInput({
    type: "password",
    required: true,
    dir: "ltr",
    defaultValue: "",
    name: "newPw",
    label: "رمز جدید",
  })
  const newPwRepeat = useNormalInput({
    type: "password",
    required: true,
    dir: "ltr",
    defaultValue: "",
    name: "newPwRepeat",
    label: "تکرار رمز جدید",
  })
  const isReady = !isEmpty(oldPw.value) && !isEmpty(newPw.value) && !isEmpty(newPwRepeat.value)

  function handleSubmission(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (newPw.value !== newPwRepeat.value) {
      toast.error("«رمز» و «تکرار رمز» با هم یکی نیستن، دوباره سعی کنین...")
      newPw.setValue("")
      newPwRepeat.setValue("")
      return
    }

    const data = JSON.stringify({
      oldPassword: sha512(oldPw.value),
      newPassword: newPw,
    })

    apiClient.fetch({
      endpoint: "/Customer/resetPassword",
      method: "PUT",
      body: data,
      onBeforeStart: () => setLoading(true),
      onFinally: () => setLoading(false),
      onSuccess() {
        oldPw.setValue("")
        newPw.setValue("")
        newPwRepeat.setValue("")
        toast.success("با موفقیت انجام شد")
      },
    })
  }

  return (
    <HeadingLine title="تعویض رمز">
      <StyledContainer onSubmit={handleSubmission}>
        <LabeledInput {...oldPw.props} />
        <LabeledInput {...newPw.props} />
        <LabeledInput {...newPwRepeat.props} />
        <Btn
          disabled={!isReady}
          isLoading={isLoading}
          icon={PenNibStraight}
          theme="primary"
          themeType="filled"
          type="submit"
        >
          تغییر رمز
        </Btn>
      </StyledContainer>
    </HeadingLine>
  )
}
