import { MESSAGES } from "@/constants"
import { toast } from "react-toastify"
import type { OrderFc, ReqOrderDto } from "vgold-shared/gen-types"
import { apiClient } from "vgold-shared/services/api-client"

export function requestOrder(data: ReqOrderDto, onSuccessCallback: (data: OrderFc) => void) {
  apiClient.fetch<OrderFc>({
    endpoint: "/Customer/ReqOrder",
    method: "POST",
    body: JSON.stringify(data),
    onSuccess(data) {
      toast.success(MESSAGES.SUCCESS_DESCRIPTION)
      onSuccessCallback?.(data)
    },
  })
}
