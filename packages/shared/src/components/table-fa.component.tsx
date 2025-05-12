import { AgGridReact } from "ag-grid-react"
import { type ComponentProps, forwardRef } from "react"
import { AG_GRID_LOCALE_IR } from "../constants"
// @ts-ignore
import { cn } from "../helpers"

const DEFAULT_COLUMN_DEFENITION = {
  minWidth: 150,
  flex: 1,
  filter: true,
  floatingFilter: true,
  lockPosition: true,
}

type TableFaProps = ComponentProps<typeof AgGridReact> & {}

export const TableFa = forwardRef<AgGridReact, TableFaProps>(({ className, ...other }, ref) => (
  <div className={cn("h-full ag-theme-quartz-dark", className)}>
    <AgGridReact
      ref={ref}
      localeText={AG_GRID_LOCALE_IR}
      pagination
      paginationPageSize={50}
      enableRtl
      defaultColDef={DEFAULT_COLUMN_DEFENITION}
      {...other}
    />
  </div>
))
