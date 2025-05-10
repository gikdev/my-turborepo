import { useInEveryPage } from "@/hooks"
import { HeadingLine } from "@/layouts"
import { GroupsNumberTable } from "./groups-number-table.component"

export function GroupsNumber() {
  useInEveryPage()

  return (
    <HeadingLine title="مدیریت گروه مشتری عددی">
      <GroupsNumberTable />
    </HeadingLine>
  )
}
