import { useInEveryPage } from "@/hooks"
import { HeadingLine } from "@/layouts"
import { GroupsGramTable } from "./groups-gram-table.component"

export function GroupsGram() {
  useInEveryPage()

  return (
    <HeadingLine title="مدیریت گروه مشتری گرمی">
      <GroupsGramTable />
    </HeadingLine>
  )
}
