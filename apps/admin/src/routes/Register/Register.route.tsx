import { Btn, Heading, Hr, LabeledInput, PError } from "@/components"
import { MESSAGES } from "@/constants"
import { useLoading } from "@/hooks"
import type { LoginModel, MasterLoginModel } from "vgold-shared/gen-types"
import { apiClient } from "vgold-shared/services/api-client"
import Cookies from "js-cookie"
import { sha512 } from "js-sha512"
import { type SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import tw from "tailwind-styled-components"

const StyledContainer = tw.form`
  bg-slatedark-2 border-2 border-slatedark-6 w-full
   px-4 py-8 flex flex-col gap-4 text-center rounded-lg max-w-96
`

export function Login() {
  const { register, handleSubmit, formState } = useForm<LoginModel>()
  const { errors } = formState
  const [isLoading, startLoading, endLoading] = useLoading(false)
  const username = register("un", { required: "نام کاربری الزامی هست" })
  const password = register("pw", { required: "رمز ورود الزامی هست" })

  const onSubmit: SubmitHandler<LoginModel> = data => {
    startLoading()
    apiClient.fetch<MasterLoginModel>({
      isLoginForm: true,
      endpoint: "/Master/loginMaster",
      method: "POST",
      body: JSON.stringify({
        un: data.un,
        pw: sha512(data.pw),
      }),
      onSuccess(data) {
        toast.success(MESSAGES.LOGIN_SUCCESSFUL)
        for (const key in data) Cookies.set(key, data[key])
        location.href = "/"
      },
      onFinally: () => endLoading(),
    })
  }

  return (
    <div className="min-h-dvh flex justify-center items-center px-4 py-8">
      <StyledContainer onSubmit={handleSubmit(onSubmit)}>
        <Heading as="h2" size={2}>
          ورود
        </Heading>
        <Hr />

        <LabeledInput {...username} type="text" label="نام کاربری:" />
        {errors.un && <PError>{errors.un.message}</PError>}

        <LabeledInput {...password} type="password" label="رمز:" />
        {errors.pw && <PError>{errors.pw.message}</PError>}

        <Btn isLoading={isLoading} type="submit" themeType="filled" theme="primary">
          ورود
        </Btn>
      </StyledContainer>
    </div>
  )
}
