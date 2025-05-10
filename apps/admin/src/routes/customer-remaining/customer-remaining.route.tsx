import { useInEveryPage } from "@/hooks"
import { HeadingLine } from "@/layouts"
import { RemainingGrid } from "./remaining-grid.component"

export function CustomerRemaining() {
  useInEveryPage()

  return (
    <HeadingLine title="مانده مشتری">
      <RemainingGrid />
    </HeadingLine>
  )
}
