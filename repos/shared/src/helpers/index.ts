import { toast } from "react-toastify"
import { ERROR_MSGS } from "../services/api-client"

export * from "./signaler.helper"
export * from "./misc.helpers"
export * from "./ui.helpers"
export * from "./api.helpers"
export * from "./api-config.helper"
export * from "./dev.helpers"

export const customToaster = {
  success(msg = "با موفقیت انجام شد") {
    toast.success(msg)
  },
  error(msg = ERROR_MSGS.GENERAL, err?: unknown) {
    if (err) console.error(String(err))
    toast.error(msg)
  },
}
