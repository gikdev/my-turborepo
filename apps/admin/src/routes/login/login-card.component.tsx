import { Btn, Heading, Hr, LabeledInput, PError } from "@/components"
import { useLoading } from "@/hooks"
import type { LoginModel } from "@repo/shared/gen-types"
import { useForm } from "react-hook-form"
import tw from "tailwind-styled-components"
import { loginAdmin } from "./login-admin.service"

const StyledContainer = tw.form`
  bg-slatedark-2 border-2 border-slatedark-6 w-full
  px-4 py-8 flex flex-col gap-4 text-center rounded-lg max-w-96
`

export function LoginCard() {
  const { register, handleSubmit, formState } = useForm<LoginModel>()
  const { errors } = formState
  const [isLoading, startLoading, endLoading] = useLoading(false)
  const un = register("un", {
    required: "نام کاربری الزامی هست",
  })
  const pw = register("pw", {
    required: "رمز ورود الزامی هست",
  })

  const onSubmit = (data: LoginModel) => {
    startLoading()
    loginAdmin(data, endLoading)
  }

  return (
    <StyledContainer onSubmit={handleSubmit(onSubmit)}>
      <Heading as="h2" size={2}>
        ورود
      </Heading>
      <Hr />

      <LabeledInput {...un} type="text" label="نام کاربری:" />
      {errors.un && <PError>{errors.un.message}</PError>}

      <LabeledInput {...pw} type="password" label="رمز:" />
      {errors.pw && <PError>{errors.pw.message}</PError>}

      <Btn isLoading={isLoading} type="submit" themeType="filled" theme="primary">
        ورود
      </Btn>
    </StyledContainer>
  )
}
