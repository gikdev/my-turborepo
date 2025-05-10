import { type ComponentProps, useRef } from "react"
import { TableFa } from "."

type SelectOneTableProps = ComponentProps<typeof TableFa> & {
  selectionKey: string
  setSelection: (selectedkeyValue: unknown) => void
}

export function SelectOneTable({
  setSelection,
  selectionKey = "id",
  ...other
}: SelectOneTableProps) {
  const tableRef = useRef(null)

  function handleSelectionChange() {
    const selectedRows = tableRef.current.api.getSelectedRows()
    if (selectedRows.length !== 1) return
    setSelection(selectedRows[0][selectionKey])
  }

  return (
    <TableFa
      ref={tableRef}
      rowSelection="single"
      onSelectionChanged={handleSelectionChange}
      {...other}
    />
  )
}
