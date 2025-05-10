import { Btn, Heading, Hr, LabeledInput, PError } from "@/components"
import { useLoading } from "@/hooks"
import { type SubmitHandler, useForm } from "react-hook-form"
import tw from "tailwind-styled-components"
import { type LoginFormData, loginUser } from "./login-user.service"

const StyledContainer = tw.form`
  bg-slatedark-2 border-2 border-slatedark-6 w-full
  px-4 py-8 flex flex-col gap-4 text-center rounded-lg max-w-96
`

export function LoginCard() {
  const { register, handleSubmit, formState } = useForm()
  const { errors } = formState
  const [isLoading, startLoading, endLoading] = useLoading(false)
  const phone = register("phone", {
    required: "شماره تلفن الزامی هست",
  })
  const password = register("password", {
    required: "رمز ورود الزامی هست",
  })

  const onSubmit: SubmitHandler<LoginFormData> = data => {
    startLoading()
    loginUser(data, endLoading)
  }

  return (
    <StyledContainer onSubmit={handleSubmit(onSubmit)}>
      <Heading as="h2" size={2}>
        ورود
      </Heading>
      <Hr />

      <LabeledInput {...phone} type="number" label="شماره تلفن:" />
      {errors.phone && <PError>{errors.phone.message}</PError>}

      <LabeledInput {...password} type="password" label="رمز:" />
      {errors.password && <PError>{errors.password.message}</PError>}

      <Btn isLoading={isLoading} type="submit" themeType="filled" theme="primary">
        ورود
      </Btn>
    </StyledContainer>
  )
}
