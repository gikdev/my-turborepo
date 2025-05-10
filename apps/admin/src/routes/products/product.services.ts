import type { StockDto } from "emex-shared/gen-types"
import { apiClient } from "emex-shared/services/api-client"
import { toast } from "react-toastify"

export function deleteProduct(id: number, cb: () => void) {
  apiClient.fetch({
    endpoint: `/TyStocks/${id}`,
    method: "DELETE",
    body: "",
    onSuccess() {
      toast.success("با موفقیت حذف شد")
      cb?.()
    },
  })
}

export function editProduct(id: number, productData: StockDto, cb: () => void) {
  apiClient.fetch({
    endpoint: `/TyStocks/${id}`,
    method: "PUT",
    body: JSON.stringify(productData),
    onSuccess() {
      toast.success("با موفقیت انجام شد")
      cb?.()
    },
  })
}

export function newProduct(data: StockDto, cb: () => void) {
  apiClient.fetch({
    endpoint: "/TyStocks",
    method: "POST",
    body: JSON.stringify(data),
    onSuccess() {
      toast.success("با موفقیت انجام شد")
      cb?.()
    },
  })
}

export function getProduct(id: number, cb: (data: StockDto[]) => void) {
  apiClient.fetch<StockDto[]>({
    endpoint: `/TyStocks/${id}`,
    onSuccess(data) {
      cb?.(data)
    },
  })
}
