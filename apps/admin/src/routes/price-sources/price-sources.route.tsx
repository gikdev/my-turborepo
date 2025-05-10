import { useInEveryPage } from "@/hooks"
import { HeadingLine } from "@/layouts"
import { StockPriceSources } from "./stock-price-table.component"

export function PriceSources() {
  useInEveryPage()

  return (
    <HeadingLine title="مدیریت منابع قیمت">
      <StockPriceSources />
    </HeadingLine>
  )
}
