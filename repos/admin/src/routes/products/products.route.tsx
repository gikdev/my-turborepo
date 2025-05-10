import ExceptionCaptureErrorBoundaryCard from "@/components/exception-capture-error-boundary-card"
import { useInEveryPage } from "@/hooks"
import { HeadingLine } from "@/layouts"
import { ProductsGrid } from "./products-grid.component"

export function Products() {
  useInEveryPage()

  return (
    <HeadingLine title="مدیریت محصولات">
      <ExceptionCaptureErrorBoundaryCard>
        <ProductsGrid />
      </ExceptionCaptureErrorBoundaryCard>
    </HeadingLine>
  )
}
