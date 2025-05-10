import type { CustomerGroupIntDto } from "@repo/shared/gen-types"
import { apiClient } from "@repo/shared/services/api-client"
import { toast } from "react-toastify"

export function deleteGroup(id: number, cb: () => void) {
  apiClient.fetch({
    endpoint: `/TyCustomerGroupIntInts/${id}`,
    method: "DELETE",
    body: "",
    onSuccess() {
      toast.success("با موفقیت حذف شد")
      cb?.()
    },
  })
}

export function editGroup(id: number, data: CustomerGroupIntDto, cb: () => void) {
  apiClient.fetch({
    endpoint: `/TyCustomerGroupIntInts/${id}`,
    method: "PUT",
    body: JSON.stringify(data),
    onSuccess() {
      toast.success("با موفقیت انجام شد")
      cb?.()
    },
  })
}

export function newGroup(data: CustomerGroupIntDto, cb: () => void) {
  apiClient.fetch({
    endpoint: "/TyCustomerGroupIntInts",
    method: "POST",
    body: JSON.stringify(data),
    onSuccess() {
      toast.success("با موفقیت انجام شد")
      cb?.()
    },
  })
}

export function getGroup(id: number, cb: (groups: CustomerGroupIntDto[]) => void) {
  apiClient.fetch<CustomerGroupIntDto[]>({
    endpoint: `/TyCustomerGroupIntInts/${id}`,
    onSuccess: data => cb?.(data),
  })
}
