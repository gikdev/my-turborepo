import { apiHelper, logOut } from "@/helpers"
import * as signalR from "@microsoft/signalr"
import { captureException } from "@sentry/react"
import Cookies from "js-cookie"
import {
  type RefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { toast } from "react-toastify"

export type ConnectionState = "unknown" | "disconnected" | "connected" | "loading"

interface SignalRContext {
  connectionState: ConnectionState
  connectionRef: RefObject<signalR.HubConnection | null>
}
const SignalRContext = createContext<SignalRContext>({
  connectionState: "unknown",
  connectionRef: {
    current: null,
  },
})

export const useSignalRContext = () => {
  const ctx = useContext(SignalRContext)
  if (!ctx) console.warn("⚠️ useHandleUpdate called without SignalR context!")
  return ctx
}

const isDev = import.meta.env.DEV
const OK_CONNECTION_STATES: ConnectionState[] = ["connected", "loading"]

export function SignalRProvider({ children }) {
  const [connectionState, setConnectionState] = useState<ConnectionState>("unknown")
  const connectionRef = useRef<signalR.HubConnection | null>(null)

  const handleConnectionFailed = useCallback(() => setConnectionState("disconnected"), [])
  const handleClose = useCallback(() => setConnectionState("disconnected"), [])
  const handleReconnected = useCallback(() => setConnectionState("connected"), [])
  const handleStarted = useCallback(() => {
    setConnectionState("connected")
    // Initialize connection with token after successful connection
    const token = Cookies.get("ttkk")

    if (token && connectionRef.current) {
      connectionRef.current.invoke("InitializeConnection", token).catch(err => {
        captureException(err)
        console.error("Error initializing connection:", err)
      })
    }
  }, [])

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .configureLogging(isDev ? signalR.LogLevel.Information : signalR.LogLevel.Error)
      .withUrl(`${apiHelper.BASE_URL}/priceHub`)
      .build()
    newConnection.onreconnected(handleReconnected)
    newConnection.onclose(handleClose)

    newConnection.on("UserNotFound", () => {
      toast.error("کاربر پیدا نشد. لطفا دوباره وارد شوید")
      const token = Cookies.get("ttkk")
      if (token) setTimeout(() => logOut(), 2 * 1000)
    })

    newConnection
      .start()
      .then(handleStarted)
      .catch(err => {
        captureException(err)
        handleConnectionFailed()
      })

    connectionRef.current = newConnection

    return () => {
      connectionRef.current?.off("UserNotFound")
      connectionRef.current?.stop().catch(err => {
        captureException(err)
        console.error("Failed to stop the connection...")
      })
    }
  }, [handleClose, handleConnectionFailed, handleReconnected, handleStarted])

  useEffect(() => {
    const interval = setInterval(() => {
      const isOKState = OK_CONNECTION_STATES.includes(connectionState)
      if (isOKState) return

      connectionRef.current
        ?.start()
        .then(handleStarted)
        .catch(err => {
          captureException(err)
          handleConnectionFailed()
        })
    }, 5000)

    return () => clearInterval(interval)
  }, [connectionState, handleStarted, handleConnectionFailed])

  return (
    <SignalRContext.Provider value={{ connectionRef, connectionState }}>
      {children}
    </SignalRContext.Provider>
  )
}
