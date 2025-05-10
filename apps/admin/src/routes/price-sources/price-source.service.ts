import type {
  StockPriceSourceAddRequest,
  StockPriceSourceEditRequest,
} from "@repo/shared/gen-types"
import { apiClient } from "@repo/shared/services/api-client"
import { toast } from "react-toastify"

export function removePriceSource(id: number, cb: () => void) {
  apiClient.fetch({
    endpoint: "/StockPriceSource/DeleteStock",
    method: "POST",
    body: JSON.stringify({ id: id }),
    onSuccess() {
      toast.success("با موفقیت حذف شد")
      cb?.()
    },
  })
}

export function editPriceSource(
  id: number,
  priceSourceData: StockPriceSourceEditRequest,
  cb: () => void,
) {
  apiClient.fetch({
    endpoint: "/StockPriceSource/EditStockPriceSource",
    method: "POST",
    body: JSON.stringify({
      ...priceSourceData,
      id: id,
    }),
    onSuccess() {
      toast.success("با موفقیت انجام شد")
      cb?.()
    },
  })
}

export function newPriceSource(data: StockPriceSourceAddRequest, cb: () => void) {
  apiClient.fetch({
    endpoint: "/StockPriceSource/AddStockPriceSource",
    method: "POST",
    body: JSON.stringify(data),
    onSuccess() {
      toast.success("با موفقیت انجام شد")
      cb?.()
    },
  })
}
