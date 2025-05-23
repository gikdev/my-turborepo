import { toast } from "react-toastify"
import type {
  StockPriceSourceAddRequest,
  StockPriceSourceEditRequest,
} from "vgold-shared/gen-types"
import { apiClient } from "vgold-shared/services/api-client"

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
