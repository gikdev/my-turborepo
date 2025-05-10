import { Pen } from "@phosphor-icons/react"
import { apiClient } from "emex-shared/services/api-client"
import { toast } from "react-toastify"

export interface MasterInfo {
  userID: never
  masterID: never
  username: never
  name: string
  rulls: string | null
  aboutUs: string | null
  mainPage: string | null
  logoUrl: string | null
  status: number
  ttkk: never
}

export const props = {
  container: {
    className: "flex flex-col sm:flex-row gap-2 items-center",
  },
  textarea: {
    className: "h-60 mb-2",
  },
  btnContainer: {
    className: "sm:rotate-180 flex sm:flex-row-reverse gap-2 w-full sm:w-auto",
  },
  btnReload: {
    className: "sm:w-12 sm:h-60 sm:[writing-mode:vertical-rl] w-full",
  },
  btnPrimary: {
    className: "sm:w-12 sm:h-60 sm:[writing-mode:vertical-rl] w-full",
    theme: "primary",
    themeType: "filled",
    icon: Pen,
  },
}

export function saveKey(key: string, content: string, cb: () => void) {
  const data = {
    dataVal: [{ key, val: content }],
  }

  apiClient.fetch({
    endpoint: "/Master/UpdateF",
    body: JSON.stringify(data),
    method: "POST",
    onSuccess: () => {
      toast.success("با موفقیت انجام شد")
      cb?.()
    },
  })
}

export const getMasterInfoConfig = () => ({
  endpoint: "/Master/GetMasterInfo",
  method: "GET",
})
