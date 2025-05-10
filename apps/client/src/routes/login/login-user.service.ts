import { apiClient } from "vgold-shared/services/api-client"
import Cookies from "js-cookie"
import { sha512 } from "js-sha512"

export interface LoginFormData {
  phone: string
  password: string
}

export function loginUser(data: LoginFormData, endLoading: () => void) {
  const hashedPw = sha512(data.password)
  const dataToSend = JSON.stringify({
    un: data.phone,
    pw: hashedPw,
  })

  apiClient.fetch<Record<string, string>>({
    endpoint: "/Customer/loginCustomer",
    method: "POST",
    body: dataToSend,
    isLoginForm: true,
    onFinally: () => endLoading(),
    onSuccess(data) {
      for (const key in data) Cookies.set(key, data[key])

      location.href = "/"
    },
  })
}
