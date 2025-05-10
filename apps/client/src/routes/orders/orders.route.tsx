import { HeadingLine } from "@/layouts"
import { OrdersTable } from "./orders-table.component"

export function Orders() {
  return (
    <HeadingLine title="سفارشات" className="h-full">
      <OrdersTable />
    </HeadingLine>
  )
}
