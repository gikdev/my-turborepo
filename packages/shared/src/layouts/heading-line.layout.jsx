import { Heading, Hr } from "../components"
import ExceptionCaptureErrorBoundaryCard from "../components/exception-capture-error-boundary-card"
import { cn } from "../helpers"

function HeadingLine({ title, className = "", children = null }) {
  const sectionClasses = cn("px-4 py-8 md:p-8", className)

  return (
    <>
      <Heading as="h1" size={5} className="text-slatedark-12 mb-4 mt-6 text-center">
        {title}
      </Heading>
      <Hr />
      <section className={sectionClasses}>
        <ExceptionCaptureErrorBoundaryCard>{children}</ExceptionCaptureErrorBoundaryCard>
      </section>
    </>
  )
}

export { HeadingLine }
