import { Heading, Hr } from "@/components"
import { cn } from "@/helpers"

function MessageCard({ title, children }) {
  const styles = {
    container: cn(
      "bg-slatedark-2 border-2 border-slatedark-6 px-4 py-8 flex flex-col gap-4 rounded-lg max-w-max",
    ),
  }

  return (
    <div className={styles.container}>
      <div className="flex flex-col gap-2">
        <Heading as="h2" size={2} className="text-center">
          {title}
        </Heading>
        <Hr />
        <p className="text-center">{children}</p>
      </div>
    </div>
  )
}

export { MessageCard }
