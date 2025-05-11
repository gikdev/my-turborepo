import { Btn, Heading, Hr, LabeledInput, PError } from "@/components"
import { useProfileContext } from "@/contexts/profile"
import { useLoading } from "@/hooks"
import { sha512 } from "js-sha512"
import { type SubmitHandler, useForm } from "react-hook-form"
import tw from "tailwind-styled-components"
import type { CustomerLoginModel } from "vgold-shared/gen-types"
import { apiClient } from "vgold-shared/services/api-client"

const StyledContainer = tw.form`
  bg-slatedark-2 border-2 border-slatedark-6 w-full
  px-4 py-8 flex flex-col gap-4 text-center rounded-lg max-w-96
`

interface LoginFormData {
  phone: string
  password: string
}

export function Login() {
  const { register, handleSubmit, formState } = useForm()
  const { errors } = formState
  const [isLoading, startLoading, endLoading] = useLoading(false)
  const { setProfile } = useProfileContext()
  const phone = register("phone", {
    required: "شماره تلفن الزامی هست",
  })
  const password = register("password", {
    required: "رمز ورود الزامی هست",
  })

  const onSubmit: SubmitHandler<LoginFormData> = data => {
    startLoading()
    const hashedPw = sha512(data.password)
    const dataToSend = JSON.stringify({
      un: data.phone,
      pw: hashedPw,
    })

    apiClient.fetch<CustomerLoginModel>({
      endpoint: "/Customer/loginCustomer",
      method: "POST",
      body: dataToSend,
      isLoginForm: true,
      onFinally: () => endLoading(),
      onSuccess(data) {
        setProfile(p => ({ ...p, ...data }))
        location.href = "/"
      },
    })
  }

  return (
    <div className="min-h-dvh flex justify-center items-center px-4 py-8">
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
    </div>
  )
}
