import { HeadingLine } from "@/layouts"
import { useGetMasterInfo } from "@/services"
import Markdown from "markdown-to-jsx"

export function Rules() {
  const [rules] = useGetMasterInfo(["rulls"])

  return (
    <HeadingLine title="شرایط و قوانین" className="text-center">
      <Markdown>{rules ? rules.toString() : ""}</Markdown>
    </HeadingLine>
  )
}
