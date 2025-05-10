import { useInEveryPage } from "@/hooks"
import { HeadingLine } from "@/layouts"
import { DocsTable } from "./docs-table.component"

export function Docs() {
  useInEveryPage()

  return (
    <HeadingLine title="مدیریت اسناد">
      <DocsTable />
    </HeadingLine>
  )
}
