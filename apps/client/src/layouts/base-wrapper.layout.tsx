import { Nav } from "@/components"
import ExceptionCaptureErrorBoundaryCard from "@/components/exception-capture-error-boundary-card"
import { Base } from "@/layouts"
import {
  Code,
  Coins,
  Info,
  PenNib,
  Receipt,
  Scales,
  Storefront,
  UserCircle,
} from "@phosphor-icons/react"
import { apiClient } from "@repo/shared/services/api-client"
import Cookies from "js-cookie"
import { type PropsWithChildren, useEffect } from "react"
import { toast } from "react-toastify"

const SIDEBAR_ITEMS = [
  { id: 1, text: Cookies.get("displayName"), icon: UserCircle, url: "/profile" },
  { id: 2, text: "معاملات", icon: Storefront, url: "/" },
  { id: 3, text: "مشاهده سفارشات", icon: Receipt, url: "/orders" },
  { id: 4, text: "ثبت سند", icon: PenNib, url: "/docs" },
  { id: 5, text: "ثبت حواله", icon: PenNib, url: "/transfers" },
  { id: 6, text: "شرایط و قوانین", icon: Scales, url: "/rules" },
  { id: 7, text: "مانده حساب", icon: Coins, url: "/remainings" },
  { id: 8, text: "درباره ما", icon: Info, url: "/about" },
]

const isDev = import.meta.env.DEV
if (isDev) SIDEBAR_ITEMS.push({ id: 9, text: "تست", icon: Code, url: "/test" })

const getTime = () =>
  apiClient.fetch({
    endpoint: "/TyStocks/GetTime",
    onError: err => toast.error(err),
  })

export function BaseWrapper({ children }: PropsWithChildren) {
  useEffect(() => {
    const timeout = setTimeout(getTime, 3 * 1000)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const interval = setInterval(getTime, 30 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <ExceptionCaptureErrorBoundaryCard>
      <Base nav={<Nav />} sidebarItems={SIDEBAR_ITEMS}>
        {children}
      </Base>
    </ExceptionCaptureErrorBoundaryCard>
  )
}
