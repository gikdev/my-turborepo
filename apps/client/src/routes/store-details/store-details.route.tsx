import { HeadingLine } from "@/layouts"
import { useGetMasterInfo } from "@/services"
import Markdown from "markdown-to-jsx"

export function StoreDetails() {
  const [name, mainPage] = useGetMasterInfo(["name", "mainPage"])

  return (
    <HeadingLine title={name ? name.toString() : ""} className="text-center">
      <Markdown>{mainPage ? mainPage.toString() : ""}</Markdown>
    </HeadingLine>
  )
}
