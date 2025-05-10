import { useInEveryPage } from "@/hooks"
import { HeadingLine } from "@/layouts"

export function Home() {
  useInEveryPage()

  return <HeadingLine title="صفحه اصلی" />
}
