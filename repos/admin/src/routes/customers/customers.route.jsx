import { useInEveryPage } from "@/hooks"
import { HeadingLine } from "@/layouts"
import { CustomersTable } from "./customers-table.component"

export function Customers() {
  useInEveryPage()

  return (
    <HeadingLine title="مدیریت کاربران">
      <CustomersTable />
    </HeadingLine>
  )
}
