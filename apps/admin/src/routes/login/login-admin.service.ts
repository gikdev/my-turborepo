import Cookies from "js-cookie"
import { sha512 } from "js-sha512"
import { toast } from "react-toastify"
import type { LoginModel, MasterLoginModel } from "vgold-shared/gen-types"
import { apiClient } from "vgold-shared/services/api-client"

export function loginAdmin(data: LoginModel, endLoading: () => void) {
  const dataToSend = JSON.stringify({
    un: data.un,
    pw: sha512(data.pw),
  })

  apiClient.fetch<MasterLoginModel>({
    isLoginForm: true,
    endpoint: "/Master/loginMaster",
    method: "POST",
    onFinally: () => endLoading(),
    body: dataToSend,
    onSuccess(data) {
      toast.success("با موفقیت وارد شدید!")
      for (const key in data) Cookies.set(key, data[key])
      location.href = "/"
    },
  })
}
