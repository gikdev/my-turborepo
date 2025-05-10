import { Nav } from "@/components"
import ExceptionCaptureErrorBoundaryCard from "@/components/exception-capture-error-boundary-card"
import { useSignalRContext } from "@/contexts/signalr.context"
import { useOnlineUsersCountContext } from "@/contexts/user-count"
import { Base } from "@/layouts"
import {
  ArrowsCounterClockwise,
  Code,
  Coins,
  Cube,
  HouseLine,
  Info,
  Mailbox,
  Receipt,
  Scales,
  Scroll,
  Storefront,
  UserCircle,
  UserCircleGear,
  UsersFour,
} from "@phosphor-icons/react"
import { ChatText } from "@phosphor-icons/react/dist/ssr"
import Cookies from "js-cookie"
import { type PropsWithChildren, useEffect } from "react"

const SIDEBAR_ITEMS = [
  { id: 0, text: "خانه", icon: HouseLine, url: "/" },
  { id: 1, text: Cookies.get("name"), icon: UserCircle, url: "/profile" },
  { id: 2, text: "ارسال پیامک", icon: ChatText, url: "/send-sms" },
  { id: 3, text: "مدیریت کاربران", icon: UserCircleGear, url: "/customers" },
  { id: 4, text: "مدیریت گروه مشتری گرمی", icon: UsersFour, url: "/groups-gram" },
  { id: 5, text: "مدیریت گروه مشتری عددی", icon: UsersFour, url: "/groups-number" },
  { id: 6, text: "کاربران آنلاین", icon: UsersFour, url: "/online-users" },
  { id: 7, text: "مدیریت منابع قیمت", icon: ArrowsCounterClockwise, url: "/price-sources" },
  { id: 8, text: "مدیریت محصولات", icon: Cube, url: "/products" },
  { id: 9, text: "مدیریت سفارشات", icon: Receipt, url: "/orders" },
  { id: 10, text: "مدیریت حواله‌ها", icon: Scroll, url: "/transfers" },
  { id: 11, text: "مدیریت سندها", icon: Scroll, url: "/docs" },
  { id: 12, text: "مانده حساب مشتری", icon: Coins, url: "/customer-remaining" },
  { id: 13, text: "مانده حساب", icon: Coins, url: "/remaining" },
  { id: 14, text: "ثبت اطلاعات فروشگاه", icon: Storefront, url: "/edit-home" },
  { id: 15, text: "ثبت قوانین", icon: Scales, url: "/edit-rules" },
  { id: 16, text: "ثبت درباره ما", icon: Info, url: "/edit-about" },
]

const isDev = import.meta.env.DEV
const devModeSidebarItem = { id: 999, text: "تست", icon: Code, url: "/test" }
if (isDev) SIDEBAR_ITEMS.push(devModeSidebarItem)

export function BaseWrapper({ children }: PropsWithChildren) {
  const { connectionRef, connectionState } = useSignalRContext()
  const { setOnlineUsersCount } = useOnlineUsersCountContext()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (connectionState !== "connected" || !connectionRef.current) return () => {}
    connectionRef.current.on("OnlineCount", c => setOnlineUsersCount(c))
    return () => connectionRef.current.off("OnlineCount")
  }, [connectionState])

  return (
    <ExceptionCaptureErrorBoundaryCard>
      <Base nav={<Nav />} sidebarItems={SIDEBAR_ITEMS}>
        {children}
      </Base>
    </ExceptionCaptureErrorBoundaryCard>
  )
}
