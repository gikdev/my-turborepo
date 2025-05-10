import { useSignalRContext } from "@/contexts/signalr.context"
import { ENUMS } from "@/enums"
import Cookies from "js-cookie"
import { createContext, useCallback, useContext, useEffect, useState } from "react"
import type { PropsWithChildren } from "react"

interface AdminContextType {
  isOnline: boolean | null
  toggleOnline: (input?: boolean) => void
}

const AdminContext = createContext<AdminContextType>({
  isOnline: null,
  toggleOnline: () => {},
})

export const useAdminContext = () => useContext(AdminContext)

export function AdminProvider({ children }: PropsWithChildren) {
  const { connectionRef, connectionState } = useSignalRContext()
  const [isOnline, setOnline] = useState(() => {
    const statusCookie = +Cookies.get("status")
    return statusCookie === ENUMS.ADMIN_STATUS.ONLINE
  })

  useEffect(() => {
    const val = isOnline
      ? ENUMS.ADMIN_STATUS.ONLINE.toString()
      : ENUMS.ADMIN_STATUS.OFFLINE.toString()
    Cookies.set("status", val)
  }, [isOnline])

  const toggleOnline = useCallback(
    (input?: boolean) => {
      const connection = connectionRef.current
      if (!connection) return
      if (connectionState !== "connected") return

      const toSet = typeof input === "boolean" ? input : !isOnline
      connection.invoke("ToggleOnline", Cookies.get("ttkk"), +Cookies.get("masterID"), toSet)
      setOnline(toSet)
    },
    [connectionState, isOnline, connectionRef.current],
  )

  return (
    <AdminContext.Provider value={{ isOnline, toggleOnline }}>{children}</AdminContext.Provider>
  )
}
