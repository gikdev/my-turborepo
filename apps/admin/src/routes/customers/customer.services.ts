import { toast } from "react-toastify"
import type {
  AddCustomerDto,
  CustomerDto,
  CustomerGroupDto,
  CustomerGroupIntDto,
  Gidto,
  UpdateCustomerForMasterDto,
} from "vgold-shared/gen-types"
import { apiClient } from "vgold-shared/services/api-client"

export function $delete(data: Gidto, cb: () => void) {
  apiClient.fetch({
    endpoint: "/Master/RemoveCustomer",
    method: "POST",
    body: JSON.stringify(data),
    onSuccess() {
      toast.success("با موفقیت حذف شد")
      cb?.()
    },
  })
}

export function $edit(data: UpdateCustomerForMasterDto, cb: () => void) {
  apiClient.fetch({
    endpoint: "/Master/UpdateCustomer",
    method: "POST",
    body: JSON.stringify(data),
    onSuccess() {
      toast.success("با موفقیت انجام شد")
      cb?.()
    },
  })
}

export function $new(data: AddCustomerDto, cb: () => void) {
  apiClient.fetch({
    endpoint: "/Master/AddCustomer",
    method: "POST",
    body: JSON.stringify(data),
    onSuccess() {
      toast.success("با موفقیت انجام شد")
      cb?.()
    },
  })
}

export function $get(id: number | string, cb: (customer: CustomerDto) => void) {
  apiClient.fetch<CustomerDto[]>({
    endpoint: "/Master/GetCustomers",
    onSuccess(customers) {
      const customer = customers.find(customer => customer.id === Number(id))
      cb?.(customer)
    },
  })
}

export function useGetAllGroups() {
  const res = apiClient.useFetch<CustomerGroupDto[]>(() => ({
    endpoint: "/TyCustomerGroups",
    defaultValue: [],
  }))

  return res.data
}

export function useGetAllGroupsInt() {
  const res = apiClient.useFetch<CustomerGroupIntDto[]>(() => ({
    endpoint: "/TyCustomerGroupIntInts",
    defaultValue: [],
  }))

  return res.data
}
