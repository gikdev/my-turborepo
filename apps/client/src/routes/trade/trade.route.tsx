import { Btn, LoadingSpinner } from "@/components"
import ExceptionCaptureErrorBoundaryCard from "@/components/exception-capture-error-boundary-card"
import { useSignalRContext } from "@/contexts/signalr.context"
import { HeadingLine } from "@/layouts"
import { useGetMasterInfo } from "@/services"
import { ArrowClockwise } from "@phosphor-icons/react"
import Markdown from "markdown-to-jsx"
import { useEffect } from "react"
import tw from "tailwind-styled-components"
import type { StockDto, StockStatus } from "vgold-shared/gen-types"
import { apiClient } from "vgold-shared/services/api-client"
import { ProductCard } from "./product-card.component"

const GridContainer = tw.div`flex flex-wrap gap-1 sm:gap-4 justify-center items-start`

export function Trade() {
  const { connectionRef } = useSignalRContext()
  const [mainPage] = useGetMasterInfo(["mainPage"])
  const res = apiClient.useFetch<StockDto[]>(() => ({
    endpoint: "/TyStocks/ForCustommer",
  }))

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!res.data) return
    connectionRef.current.on("ReceivePriceUpdate", handlePriceChange)

    return () => void connectionRef.current.off("ReceivePriceUpdate")
  }, [res.data])

  function handlePriceChange(
    stockID: number,
    newPrice: number,
    priceType: string,
    date: string,
    status: StockStatus,
  ) {
    const clonedProducts = [...res.data]
    const targetStockIndex = clonedProducts.findIndex(product => product.id === stockID)
    clonedProducts[targetStockIndex][priceType] = Number(newPrice)
    clonedProducts[targetStockIndex].dateUpdate = date
    if (["number", "string"].includes(typeof status)) {
      clonedProducts[targetStockIndex].status = status
    }
    res.setData(clonedProducts)
  }

  return (
    <>
      <ExceptionCaptureErrorBoundaryCard>
        <div className="bg-slatedark-2 border border-slatedark-6 rounded-md py-6 px-3 text-center mx-auto max-w-96 mt-10">
          <Markdown>{(mainPage ? mainPage.toString() : "")?.replaceAll("\n", "<br>")}</Markdown>
        </div>
      </ExceptionCaptureErrorBoundaryCard>
      <HeadingLine title="معاملات">
        <Btn className="mb-5 mx-auto" icon={ArrowClockwise} onClick={() => res.reload()}>
          تازه سازی
        </Btn>

        <GridContainer>
          <ExceptionCaptureErrorBoundaryCard>
            {res.status.isLoading && <LoadingSpinner />}
            {res.status.isEmpty && <p>خبری نیست...</p>}
            {res.status.isFull && res.data.map(p => <ProductCard {...p} key={p.id} />)}
          </ExceptionCaptureErrorBoundaryCard>
        </GridContainer>
      </HeadingLine>
    </>
  )
}
