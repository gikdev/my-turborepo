import { useInEveryPage } from "@/hooks"

export function Test() {
  useInEveryPage()

  return (
    <div className="p-5 font-bold text-2xl text-center" dir="ltr">
      你好
    </div>
  )
}
