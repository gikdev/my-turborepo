import * as signalR from "@microsoft/signalr"
import Cookies from "js-cookie"
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import { apiHelper, logOut } from "../helpers"

const SignalRContext = createContext()

export const useSignalRContext = () => {
  const context = useContext(SignalRContext)
  if (!context) {
    throw new Error("useSignalRContext must be used within a SignalRProvider")
  }
  return context
}

const isDev = import.meta.env.DEV
const OK_CONNECTION_STATES = ["connected", "loading"]

export function SignalRProvider({ children }) {
  // Available states: "disconnected" | "connected" | "unknown"
  const [connectionState, setConnectionState] = useState("unknown")
  const connectionRef = useRef(null)

  const value = { connectionRef, connectionState }

  const handleConnectionFailed = useCallback(() => setConnectionState("disconnected"), [])
  const handleClose = useCallback(() => setConnectionState("disconnected"), [])
  const handleReconnected = useCallback(() => setConnectionState("connected"), [])
  const handleStarted = useCallback(() => {
    setConnectionState("connected")
    // Initialize connection with token after successful connection
    const token = Cookies.get("ttkk")
    if (token && connectionRef.current) {
      connectionRef.current
        .invoke("InitializeConnection", token)
        .catch(err => console.error("Error initializing connection:", err))
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

    newConnection.start().then(handleStarted).catch(handleConnectionFailed)
    connectionRef.current = newConnection

    return () => {
      connectionRef.current?.off("UserNotFound")
      connectionRef.current?.stop().catch(() => console.error("Failed to stop the connection..."))
    }
  }, [handleClose, handleConnectionFailed, handleReconnected, handleStarted])

  useEffect(() => {
    const interval = setInterval(() => {
      const isOKState = OK_CONNECTION_STATES.includes(connectionState)
      if (isOKState) return

      connectionRef.current?.start().then(handleStarted).catch(handleConnectionFailed)
    }, 5000)

    return () => clearInterval(interval)
  }, [connectionState, handleStarted, handleConnectionFailed])

  return <SignalRContext.Provider value={value}>{children}</SignalRContext.Provider>
}
