import { HeadingLine } from "@/layouts"
import { useGetMasterInfo } from "@/services"
import Markdown from "markdown-to-jsx"

export function Home() {
  const [mainPage] = useGetMasterInfo(["mainPage"])

  return (
    <HeadingLine title="صفحه اصلی" className="text-center">
      <Markdown>{mainPage ? mainPage.toString() : ""}</Markdown>
    </HeadingLine>
  )
}
