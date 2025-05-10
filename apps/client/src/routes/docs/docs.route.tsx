import { Hr } from "@/components"
import ExceptionCaptureErrorBoundaryCard from "@/components/exception-capture-error-boundary-card"
import { useSignaler } from "@/hooks"
import { HeadingLine } from "@/layouts"
import { DocsTable } from "./docs-table.component"
import { NewDocForm } from "./new-doc-form.component"

export function Docs() {
  const signaler = useSignaler()

  return (
    <HeadingLine title="ثبت سند" className="text-center 2xl:flex 2xl:gap-4 2xl:*:w-full">
      <ExceptionCaptureErrorBoundaryCard>
        <DocsTable signaler={signaler} />
      </ExceptionCaptureErrorBoundaryCard>
      <Hr className="my-4 block 2xl:hidden" />
      <ExceptionCaptureErrorBoundaryCard>
        <NewDocForm signaler={signaler} />
      </ExceptionCaptureErrorBoundaryCard>
    </HeadingLine>
  )
}
