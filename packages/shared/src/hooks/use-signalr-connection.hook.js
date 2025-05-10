import * as signalR from "@microsoft/signalr"
import { useEffect, useRef, useState } from "react"
import { apiHelper } from "../helpers"

function useSignalrConnection(hubName, masterID, token, connectedCallback) {
  const [isConnected, setIsConnected] = useState(false)
  const conn = useRef(null)
  const options = { accessTokenFactory: () => token }

  // biome-ignore lint/correctness/useExhaustiveDependencies: hubName, and connectedCallback are not going to change!
  useEffect(() => {
    conn.current = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.None)
      .withUrl(`${apiHelper.BASE_URL}${hubName}`)
      .build()
    conn.current
      .start()
      .then(() => {
        setIsConnected(true)
        if (connectedCallback) return connectedCallback()
      })
      .catch(console.error)
  }, [])

  return { isConnected, conn }
}

export { useSignalrConnection }
