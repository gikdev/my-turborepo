import { Btn, Heading, Hr, Select } from "@/components"
import { PERSIAN_ENUMS } from "@/enums"
import { TitledCard } from "@/layouts"
import { Check, Lock, Pen, Trash } from "@phosphor-icons/react"
import { useState } from "react"
import { Link } from "wouter"
import { PriceControl } from "./price-control.component"

const { PRODUCT_STATUS } = PERSIAN_ENUMS

const btnsSharedProps = {
  className: "p-0 w-10",
}

export function ProductCard({
  id,
  index,
  name,
  dateText,
  status,
  priceMain,
  buyDiff,
  sellDiff,
  listeners,
}) {
  const [isA11ySelectionMode, setA11ySelectionMode] = useState(false)
  const [a11yLevel, setA11yLevel] = useState(status)

  function handleLockClick() {
    setA11ySelectionMode(true)
  }
  function submitA11y() {
    setA11ySelectionMode(false)

    listeners.changeA11y(index, a11yLevel)
  }

  return (
    <TitledCard className="max-w-[25rem] md:max-w-[40rem] w-full min-w-max flex flex-col gap-4">
      <header className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <Heading as="h3" size={2} className="text-slatedark-12">
            {name}
          </Heading>
          <p className="text-xs">{dateText}</p>
        </div>

        {isA11ySelectionMode && (
          <div className="flex gap-2">
            <Select
              value={a11yLevel}
              onChange={e => setA11yLevel(e.target.value)}
              className="px-3 py-2 max-w-max"
            >
              {Object.keys(PRODUCT_STATUS).map(key => (
                <option key={key} value={key}>
                  {PRODUCT_STATUS[key]}
                </option>
              ))}
            </Select>
            <Btn {...btnsSharedProps} onClick={submitA11y} theme="success" icon={Check} />
          </div>
        )}

        <div className="flex gap-2">
          {!isA11ySelectionMode && (
            <Btn {...btnsSharedProps} onClick={handleLockClick} theme="info" icon={Lock} />
          )}
          <Btn
            as={Link}
            {...btnsSharedProps}
            theme="warning"
            icon={Pen}
            href={`/products/manage?id=${id}`}
          />
          <Btn
            {...btnsSharedProps}
            onClick={() => listeners.deleteItem(index)}
            theme="error"
            icon={Trash}
          />
        </div>
      </header>
      <Hr />
      <main className="flex flex-col md:flex-row gap-4 justify-center md:justify-between">
        <PriceControl
          {...listeners.buyDiff}
          index={index}
          textTheme="text-jadedark-11"
          title="اختلاف خرید"
          rawPrice={buyDiff}
        />
        <PriceControl
          {...listeners.priceMain}
          index={index}
          textTheme="text-slatedark-11"
          title="قیمت"
          rawPrice={priceMain}
        />
        <PriceControl
          {...listeners.sellDiff}
          index={index}
          textTheme="text-reddark-11"
          title="اختلاف فروش"
          rawPrice={sellDiff}
        />
      </main>
    </TitledCard>
  )
}
