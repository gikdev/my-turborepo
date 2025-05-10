import { Heading, Hr } from "@/components"
import { useAdminContext } from "@/contexts"
import { useSignalRContext } from "@/contexts/signalr.context"
import { ENUMS } from "@/enums"
import { PersianDate, getTimeFa } from "@/utils"
import type { StockDto } from "vgold-shared/gen-types"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import tw from "tailwind-styled-components"
import { Pricy } from "./pricy.component"
import { ProductForm } from "./product-form.component"

const StyledContainer = tw.div`
  bg-slatedark-2 border-2 border-slatedark-6 
  p-2 flex flex-col gap-2 min-w-full
  rounded-md max-w-max sm:min-w-80
`

interface ProductCardProps extends StockDto {}

export function ProductCard({
  id,
  name,
  dateUpdate,
  price,
  diffBuyPrice,
  diffSellPrice,
  status,
  unitPriceRatio,
  decimalNumber,
  mode,
  maxAutoMin,
  unit,
  minValue,
  maxValue,
  minVoume,
  maxVoume,
  supply,
}: ProductCardProps) {
  // productData: { id, name, price, diffBuyPrice, diffSellPrice, dateUpdate, decimalNumber, status, mode, unitPriceRatio, maxAutoMin }
  const [selectedMode, setSelectedMode] = useState("")
  const { isOnline } = useAdminContext()
  const { connectionState } = useSignalRContext()

  const modeText = selectedMode === "buy" ? "خرید" : selectedMode === "sell" ? "فروش" : "ناشناخته"
  const isGroupModeInt = unit === 1
  const lastUpdated = new PersianDate(dateUpdate)
  const updateDate = lastUpdated.toLocaleDateString()
  const updateTime = getTimeFa(lastUpdated.toDateString())

  const groupDiffBuyPrice = Number(Cookies.get("diffBuyPrice") ?? 0)
  const groupDiffSellPrice = Number(Cookies.get("diffSellPrice") ?? 0)
  const groupIntDiffBuyPrice = Number(Cookies.get("diffBuyPriceInt") ?? 0)
  const groupIntDiffSellPrice = Number(Cookies.get("diffSellPriceInt") ?? 0)
  const selectedGroupDiffBuyPrice = isGroupModeInt ? groupIntDiffBuyPrice : groupDiffBuyPrice
  const selectedGroupDiffSellPrice = isGroupModeInt ? groupIntDiffSellPrice : groupDiffSellPrice

  const totalBuyPrice = price + selectedGroupDiffBuyPrice + diffBuyPrice
  const totalSellPrice = price - selectedGroupDiffSellPrice - diffSellPrice

  const isBuyBtnEnabled =
    status !== ENUMS.PRODUCT_STATUS.DISABLED &&
    status !== ENUMS.PRODUCT_STATUS.SELL_ONLY &&
    isOnline &&
    connectionState === "connected"
  const isSellBtnEnabled =
    status !== ENUMS.PRODUCT_STATUS.DISABLED &&
    status !== ENUMS.PRODUCT_STATUS.BUY_ONLY &&
    isOnline &&
    connectionState === "connected"

  // If the admin went offline, close forms...
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isOnline && connectionState === "connected") return

    setSelectedMode("")
  }, [isOnline, selectedMode, connectionState])

  function handleBuyBtnClick() {
    const nextMode = selectedMode === "buy" ? "" : "buy"
    setSelectedMode(nextMode)
  }

  function handleSellBtnClick() {
    const nextMode = selectedMode === "sell" ? "" : "sell"
    setSelectedMode(nextMode)
  }

  return (
    <StyledContainer>
      <div className="flex flex-col gap-2">
        <Heading as="h2" size={1} className="text-center">
          {name}
        </Heading>
        <p className="text-[10px] text-center">
          {updateDate} - {updateTime}
        </p>
      </div>
      <Hr />
      <div className="flex flex-wrap gap-2">
        <Pricy
          mode="buy"
          btnEnabled={isBuyBtnEnabled}
          price={totalBuyPrice}
          isActive={selectedMode === "buy"}
          onBtnClick={handleBuyBtnClick}
        />
        <Pricy
          mode="sell"
          btnEnabled={isSellBtnEnabled}
          price={totalSellPrice}
          isActive={selectedMode === "sell"}
          onBtnClick={handleSellBtnClick}
        />
      </div>
      {!!selectedMode.length && (
        <>
          <Hr />
          <ProductForm
            id={id}
            totalBuyPrice={totalBuyPrice}
            totalSellPrice={totalSellPrice}
            decimalNumber={decimalNumber}
            basePrice={price}
            unitPriceRatio={unitPriceRatio}
            modeText={modeText}
            onRefusion={() => setSelectedMode("")}
            maxAutoMin={maxAutoMin}
            unit={unit}
            mode={mode}
            minValue={minValue}
            maxValue={maxValue}
            minVolume={minVoume}
            maxVolume={maxVoume}
            supply={supply}
          />
        </>
      )}
    </StyledContainer>
  )
}
