import { Btn, TableFa } from "@/components"
import { useSignalRContext } from "@/contexts/signalr.context"
import { useOnlineUsersCountContext } from "@/contexts/user-count"
import { formatters } from "@/helpers"
import { useInEveryPage } from "@/hooks"
import { HeadingLine } from "@/layouts"
import { ArrowCounterClockwise } from "@phosphor-icons/react"
import { type ComponentProps, useEffect, useState } from "react"
import { toast } from "react-toastify"

const COLUMN_DEFINITIONS: ComponentProps<typeof TableFa>["columnDefs"] = [
  {
    field: "id" as never,
    headerName: "آیدی",
    valueFormatter: formatters.persianNumber,
  },
  { field: "displayName" as never, headerName: "نام" },
  {
    field: "mobile" as never,
    headerName: "موبایل",
    valueFormatter: formatters.persianNumber,
  },
  { field: "isActive" as never, headerName: "فعال هست؟" },
  { field: "isBlocked" as never, headerName: "مسدود کردن معامله" },
  {
    field: "allowedDevices" as never,
    headerName: "تعداد دستگاه های مجاز",
    valueFormatter: formatters.persianNumber,
  },
  {
    field: "connectedDevices" as never,
    headerName: "تعداد دستگاه‌های فعال",
    valueFormatter: formatters.persianNumber,
  },
]

export function OnlineUsers() {
  useInEveryPage()
  const { connectionRef, connectionState } = useSignalRContext()
  const [onlineUsers, setOnlineUsers] = useState([])
  const { onlineUsersCount, setOnlineUsersCount } = useOnlineUsersCountContext()

  const getOnlineUsers = () => {
    const connection = connectionRef.current

    if (!connection || connectionState !== "connected") return

    connection
      .invoke("GetConnectedUsers")
      .then(users => setOnlineUsers(users))
      .catch(e => toast.error("یه مشکلی پیش آمده (E-AXE6785)"))
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (connectionState === "connected" && connectionRef.current) {
      getOnlineUsers()

      const onOnlineCount = (count: number) => {
        setOnlineUsersCount(count || "؟")
        getOnlineUsers()
      }

      connectionRef.current?.on("OnlineCount", onOnlineCount)

      return () => connectionRef.current?.off("OnlineCount")
    }
  }, [connectionState])

  return (
    <HeadingLine title="کاربران آنلاین">
      <Btn icon={ArrowCounterClockwise} onClick={() => getOnlineUsers()} className="mb-3 mx-auto">
        تازه سازی
      </Btn>
      <p className="mb-5 text-center">تعداد کاربران آنلاین: {onlineUsersCount}</p>
      <TableFa className="h-[40rem]" rowData={onlineUsers} columnDefs={COLUMN_DEFINITIONS} />
    </HeadingLine>
  )
}
