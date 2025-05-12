import avatarPlaceholder from "@/assets/avatar-placeholder.png"
import { useSignalRContext } from "@/contexts/signalr.context"
import { ENUMS } from "@/enums"
import { useGetMasterInfo } from "@/services"
import { createContext, useContext, useEffect, useState } from "react"
import type { MasterStatus } from "vgold-shared/gen-types"
import { useProfileContext } from "./profile"

interface AdminContext {
  logoUrl: string
  shopName: string
  isOnline: boolean
  adminStatus: MasterStatus
}
const AdminContext = createContext({
  logoUrl: avatarPlaceholder,
  shopName: "",
  isOnline: false,
  adminStatus: 5,
})

export const useAdminContext = () => useContext(AdminContext)

export function AdminProvider({ children }) {
  const [isOnline, setIsOnline] = useState(false)
  const [adminStatus, setAdminStatus] = useState(0)
  const { connectionRef } = useSignalRContext()
  const { profile } = useProfileContext()
  const [logoUrl, shopName, adminStatusData] = useGetMasterInfo(["logoUrl", "name", "status"]) as [
    string,
    string,
    MasterStatus,
  ]
  const value = { isOnline, logoUrl, shopName, adminStatus }

  useEffect(() => {
    if (!adminStatusData) return

    const _isOnline = adminStatusData === ENUMS.ADMIN_STATUS.ONLINE
    setIsOnline(_isOnline)
    setAdminStatus(adminStatusData)
  }, [adminStatusData])

  useEffect(() => {
    if (!connectionRef.current) return undefined

    connectionRef.current.on("MasterStatusChange", (incomingMasterId, _isOnline) => {
      const masterId = profile?.masterID
      if (typeof masterId !== "number" || masterId !== incomingMasterId) return
      setAdminStatus(_isOnline ? ENUMS.ADMIN_STATUS.ONLINE : ENUMS.ADMIN_STATUS.OFFLINE)
      setIsOnline(_isOnline)
    })

    return () => connectionRef.current.off("MasterStatusChange")
  }, [connectionRef.current, profile?.masterID])

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}
