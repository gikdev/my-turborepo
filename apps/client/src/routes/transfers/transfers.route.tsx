import { Hr } from "@/components"
import ExceptionCaptureErrorBoundaryCard from "@/components/exception-capture-error-boundary-card"
import { useSignaler } from "@/hooks"
import { HeadingLine } from "@/layouts"
import { NewTransferForm } from "./new-transfer-form.component"
import { TransfersTable } from "./transfers-table.component"

export function Transfers() {
  const signaler = useSignaler()

  return (
    <HeadingLine title="ثبت حواله" className="text-center 2xl:flex 2xl:gap-4 2xl:*:w-full">
      <ExceptionCaptureErrorBoundaryCard>
        <TransfersTable signaler={signaler} />
      </ExceptionCaptureErrorBoundaryCard>
      <Hr className="my-4 block 2xl:hidden" />
      <ExceptionCaptureErrorBoundaryCard>
        <NewTransferForm signaler={signaler} />
      </ExceptionCaptureErrorBoundaryCard>
    </HeadingLine>
  )
}
