import { toast } from "react-toastify"
import { apiClient } from "vgold-shared/services/api-client"

// accject -> ACCept / REJECT
export function accjectOrder(
  isOrderNotif: boolean,
  id: number,
  isAccepted: boolean,
  cb: () => void,
) {
  const dataToSend = {
    gid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    id: Number(id),
    str: "",
    tf: isAccepted,
  }

  apiClient.fetch({
    endpoint: "/Master/AcceptOrders",
    method: "POST",
    body: JSON.stringify(dataToSend),
    onSuccess() {
      cb?.()
      if (isOrderNotif) return
      toast.success("با موفقیت انجام شد...")
    },
  })
}
