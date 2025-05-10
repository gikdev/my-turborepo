import { MESSAGES } from "@/constants"
import type { OrderFc, ReqOrderDto } from "@repo/shared/gen-types"
import { apiClient } from "@repo/shared/services/api-client"
import { toast } from "react-toastify"

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

export function getOrderStatusByID(id: number, onError = () => {}) {}
