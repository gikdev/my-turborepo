import { Nav } from "@/components"
import ExceptionCaptureErrorBoundaryCard from "@/components/exception-capture-error-boundary-card"
import { useGetProfileUpdater, useProfileContext } from "@/contexts/profile"
import { useSignalRContext } from "@/contexts/signalr.context"
import { Base } from "@/layouts"
import { Coins, Info, PenNib, Receipt, Scales, Storefront, UserCircle } from "@phosphor-icons/react"
import { type PropsWithChildren, useEffect, useMemo } from "react"
import { toast } from "react-toastify"
import { apiClient } from "vgold-shared/services/api-client"

const getTime = () =>
  apiClient.fetch({
    endpoint: "/TyStocks/GetTime",
    onError: err => toast.error(err),
  })

export function BaseWrapper({ children }: PropsWithChildren) {
  const { connectionRef } = useSignalRContext()
  const { profile } = useProfileContext()
  const updateProfile = useGetProfileUpdater()

  const SIDEBAR_ITEMS = useMemo(
    () => [
      { id: 1, text: profile?.displayName, icon: UserCircle, url: "/profile" },
      { id: 2, text: "معاملات", icon: Storefront, url: "/" },
      { id: 3, text: "مشاهده سفارشات", icon: Receipt, url: "/orders" },
      { id: 4, text: "ثبت سند", icon: PenNib, url: "/docs" },
      { id: 5, text: "ثبت حواله", icon: PenNib, url: "/transfers" },
      { id: 6, text: "شرایط و قوانین", icon: Scales, url: "/rules" },
      { id: 7, text: "مانده حساب", icon: Coins, url: "/remainings" },
      { id: 8, text: "درباره ما", icon: Info, url: "/about" },
    ],
    [profile?.displayName],
  )

  const loadProfile = useGetProfileUpdater()
  useEffect(loadProfile, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    connectionRef.current.on("UpdateCustomer", (customerId: number) => {
      const isCurrentCustomer = customerId === profile?.customerID
      if (isCurrentCustomer) updateProfile()
    })

    return () => void connectionRef.current.off("UpdateCustomer")
  }, [])

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
