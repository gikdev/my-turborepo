import { useInEveryPage } from "@/hooks"
import { HeadingLine } from "@/layouts"
import { OrdersTable } from "./orders-table.component"

export function Orders() {
  useInEveryPage()

  return (
    <HeadingLine title="مدیریت سفارشات">
      <OrdersTable />
    </HeadingLine>
  )
}
