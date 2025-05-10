import { HeadingLine } from "@/layouts"
import { useGetMasterInfo } from "@/services"
import Markdown from "markdown-to-jsx"

export function About() {
  const [aboutUs] = useGetMasterInfo(["aboutUs"])

  return (
    <HeadingLine title="درباره ما" className="text-center">
      <Markdown>{aboutUs ? aboutUs.toString() : ""}</Markdown>
    </HeadingLine>
  )
}
