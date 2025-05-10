import { Badge, Btn } from "@/components"
import { useAdminContext, useUIContext } from "@/contexts"
import { baseUrl, cn } from "@/helpers"
import styled from "@master/styled.react"
import { List } from "@phosphor-icons/react"
import tw from "tailwind-styled-components"
import { Link } from "wouter"
import { ConnectionIndicator } from "./connection-indicator.component"

function calculateFinalLogoUrl(sth: string | undefined | null) {
  if (typeof sth !== "string" || !sth.length) return "STUPIDOTTA!"

  if (sth.startsWith("http")) return sth

  return `${baseUrl}/${sth}`
}

const StyledNav = tw.nav`flex items-center justify-between border-b border-slatedark-6 p-4`

const StyledAdminChip = styled(Link)`flex gap-2 items-center justify-center`

export function Nav() {
  const adminStatus = useAdminContext()
  const { sidebar } = useUIContext()
  const adminLogo = calculateFinalLogoUrl(adminStatus.logoUrl)

  const profileWrapperClasses = cn("size-10 rounded-full relative", {
    "md:after:hidden after:size-4 after:rounded-full after:bg-jadedark-11 after:border-[3px] after:border-jadedark-3 after:top-0 after:start-0 after:absolute after:inline-block":
      adminStatus.isOnline,
  })

  return (
    <StyledNav>
      <Link className="hidden md:inline-block" href="/">
        <img src="/images/vgold-full.png" alt="" className="max-h-16" />
      </Link>
      <Btn className="w-10 p-0 flex md:hidden" onClick={sidebar.open} icon={List} />
      <StyledAdminChip href="/store-details">
        <ConnectionIndicator />
        <Badge
          className="hidden md:inline-block"
          theme={adminStatus.isOnline ? "success" : "neutral"}
        >
          {adminStatus.isOnline ? "آنلاین" : "آفلاین"}
        </Badge>
        <p className="text-sm">{adminStatus.shopName}</p>
        <div className={profileWrapperClasses}>
          <img src={adminLogo} alt="" className="rounded-full" />
        </div>
      </StyledAdminChip>
    </StyledNav>
  )
}
