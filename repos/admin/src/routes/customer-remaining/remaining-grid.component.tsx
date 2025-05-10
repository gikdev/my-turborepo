import { useListen, useSignaler } from "@/hooks"
import { useState } from "react"
import { CustomerRemainingTable } from "./customer-remaining-table.component"
import { CustomerTable } from "./customer-table.component"
import { DocForm } from "./doc.form"
import { TransferForm } from "./transfer.form"

export function RemainingGrid() {
  const [selectedCustomer, setSelectedCustomer] = useState<number>()
  const [selectedRemaining, setSelectedRemaining] = useState()
  const [selectedMobile, setSelectedMobile] = useState<string>()
  const [selectedStock, setSelectedStock] = useState()
  const signaler = useSignaler()
  const isAnyCustomerSelected = typeof selectedCustomer === "number"
  const isAnyRemainingSelected = typeof selectedRemaining === "number"
  const isDocMode = selectedRemaining === 0
  const isTransferMode = typeof selectedRemaining === "number" && selectedRemaining > 0

  useListen(signaler, "close form", () => setSelectedRemaining(null))

  function handleCustomerChange(input) {
    setSelectedCustomer(input)
    setSelectedRemaining(null)
  }

  return (
    <div className="grid xl:grid-cols-2 gap-4">
      <CustomerTable setSelection={handleCustomerChange} setMobile={setSelectedMobile} />
      {isAnyCustomerSelected && (
        <CustomerRemainingTable
          signaler={signaler}
          setSelection={setSelectedRemaining}
          setStock={setSelectedStock}
          selectedCustomerID={selectedCustomer}
        />
      )}
      <div className="xl:col-span-2">
        {isAnyRemainingSelected && isTransferMode && (
          <TransferForm
            signaler={signaler}
            customerID={selectedCustomer}
            stockID={selectedStock}
            defaultMobile={selectedMobile}
          />
        )}
        {isAnyRemainingSelected && isDocMode && (
          <DocForm signaler={signaler} customerID={selectedCustomer} />
        )}
      </div>
    </div>
  )
}
