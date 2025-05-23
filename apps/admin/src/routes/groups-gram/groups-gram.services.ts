import { toast } from "react-toastify"
import type { CustomerGroupDto } from "vgold-shared/gen-types"
import { apiClient } from "vgold-shared/services/api-client"

export function deleteGroup(id: number, cb: () => void) {
  apiClient.fetch({
    endpoint: `/TyCustomerGroups/${id}`,
    method: "DELETE",
    body: "",
    onSuccess() {
      toast.success("با موفقیت حذف شد")
      cb?.()
    },
  })
}

export function editGroup(id: number, data: CustomerGroupDto, cb: () => void) {
  apiClient.fetch({
    endpoint: `/TyCustomerGroups/${id}`,
    method: "PUT",
    body: JSON.stringify(data),
    onSuccess() {
      toast.success("با موفقیت انجام شد")
      cb?.()
    },
  })
}

export function newGroup(data: CustomerGroupDto, cb: () => void) {
  apiClient.fetch({
    endpoint: "/TyCustomerGroups",
    method: "POST",
    body: JSON.stringify(data),
    onSuccess() {
      toast.success("با موفقیت انجام شد")
      cb?.()
    },
  })
}

export function getGroup(id: number, cb: (groups: CustomerGroupDto[]) => void) {
  apiClient.fetch<CustomerGroupDto[]>({
    endpoint: `/TyCustomerGroups/${id}`,
    onSuccess: data => cb?.(data),
  })
}
