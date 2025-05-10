import { Globe, GlobeX, Question } from "@phosphor-icons/react"
import { useSignalRContext } from "../contexts"
import { cn } from "../helpers"

export function ConnectionIndicator() {
  const { connectionState } = useSignalRContext()
  let Icon = Question
  const containerClassName = cn("p-1 rounded-full bg-slatedark-4 text-slatedark-11", {
    "bg-jadedark-4 text-jadedark-11": connectionState === "connected",
    "bg-reddark-4 text-reddark-11": connectionState === "disconnected",
  })

  if (connectionState === "connected") Icon = Globe
  if (connectionState === "disconnected") Icon = GlobeX

  return (
    <div className={containerClassName}>
      <Icon size={24} />
    </div>
  )
}
