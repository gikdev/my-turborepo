import { useInEveryPage } from "@/hooks"
import { HeadingLine } from "@/layouts"
import { TransfersTable } from "./transfers-table.component"

export function Transfers() {
  useInEveryPage()

  return (
    <HeadingLine title="مدیریت حواله‌ها">
      <TransfersTable />
    </HeadingLine>
  )
}
