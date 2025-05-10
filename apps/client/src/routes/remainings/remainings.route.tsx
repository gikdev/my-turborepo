import { HeadingLine } from "@/layouts"
import { RemainingsTable } from "./remainings-table.component"

export function Remainings() {
  return (
    <HeadingLine title="مانده حساب" className="h-full">
      <RemainingsTable />
    </HeadingLine>
  )
}
