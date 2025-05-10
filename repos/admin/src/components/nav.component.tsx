import avatarPlaceholder from "@/assets/avatar-placeholder.png"
import { Btn, Switch } from "@/components"
import { ConnectionIndicator } from "@/components/connection-indicator.component"
import { useAdminContext, useUIContext } from "@/contexts"
import { useOnlineUsersCountContext } from "@/contexts/user-count"
import { baseUrl, cn } from "@/helpers"
import styled from "@master/styled.react"
import { List } from "@phosphor-icons/react"
import Cookies from "js-cookie"
import tw from "tailwind-styled-components"
import { Link, useLocation } from "wouter"

const StyledNav = tw.nav`flex items-center justify-between border-b border-slatedark-6 p-4`
const StyledAdminChip = styled(Link)`flex flex-row-reverse gap-2 items-center justify-center`

export function Nav() {
  const { sidebar } = useUIContext()
  const { isOnline, toggleOnline } = useAdminContext()
  const { onlineUsersCount } = useOnlineUsersCountContext()
  const [, navigate] = useLocation()
  const logoUrl =
    (Cookies.get("logoUrl")?.includes("http")
      ? Cookies.get("logoUrl")
      : `${baseUrl}/${Cookies.get("logoUrl")}`) || avatarPlaceholder
  const displayName = Cookies.get("name") ?? "طلا فروشی ناکجاآباد"

  const profileWrapperClasses = cn("size-10 rounded-full relative", {
    "md:after:hidden after:size-4 after:rounded-full after:bg-jadedark-11 after:border-[3px] after:border-jadedark-3 after:top-0 after:start-0 after:absolute after:inline-block": true,
  })

  return (
    <StyledNav>
      <Link className="hidden md:inline-block" href="/">
        <img src="/images/vgold-full.png" alt="" className="max-h-16" />
      </Link>
      <Btn className="w-10 p-0 flex md:hidden" onClick={sidebar.open} icon={List} />
      <div className="flex flex-row-reverse gap-2 items-center justify-center">
        <StyledAdminChip href="/">
          <div className={profileWrapperClasses}>
            <img src={logoUrl} alt="" className="w-full h-full object-cover rounded-full" />
          </div>
          <p className="text-sm">{displayName}</p>
        </StyledAdminChip>
        <Switch onCheckedChange={toggleOnline} checked={isOnline} />
        <ConnectionIndicator />
        <abbr title="تعداد تمام کاربران آنلاین" className="no-underline">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full bg-jadedark-4 text-jadedark-11"
            type="button"
            onClick={() => navigate("/online-users")}
          >
            {onlineUsersCount}
          </button>
        </abbr>
      </div>
    </StyledNav>
  )
}
