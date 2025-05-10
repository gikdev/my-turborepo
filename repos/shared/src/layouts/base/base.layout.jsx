import { useEffect } from "react"
import ExceptionCaptureErrorBoundaryCard from "../../components/exception-capture-error-boundary-card"
import { useSmartLoginManager } from "../../hooks"
import { Sidebar } from "./sidebar.component"

function Base({ children, nav, sidebarItems }) {
  useSmartLoginManager()

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then(p => console.log("NotifPermission:", p))
    }
  }, [])

  return (
    <>
      <header>{nav}</header>
      <main className="flex grow shrink">
        <Sidebar items={sidebarItems} />
        <section className="grow shrink">
          <ExceptionCaptureErrorBoundaryCard>{children}</ExceptionCaptureErrorBoundaryCard>
        </section>
      </main>
    </>
  )
}

export { Base }
