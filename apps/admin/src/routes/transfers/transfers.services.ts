import { apiClient } from "@repo/shared/services/api-client"
import { toast } from "react-toastify"

export function accjectTransfer(id: number, isAccepted: boolean, cb: () => void) {
  apiClient.fetch({
    endpoint: "/Master/AcceptTransfer",
    method: "POST",
    body: JSON.stringify({
      gid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      id: Number(id),
      str: "",
      tf: isAccepted,
    }),
    onSuccess() {
      toast.success("با موفقیت انجام شد")
      cb?.()
    },
  })
}
