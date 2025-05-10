import { type PropsWithChildren, createContext, useContext, useState } from "react"

type OnlineUsersCount = "؟" | number

interface OnlineUsersCountContext {
  onlineUsersCount: OnlineUsersCount
  setOnlineUsersCount: (n: OnlineUsersCount) => void
}

const OnlineUsersCountContext = createContext<OnlineUsersCountContext>({
  onlineUsersCount: "؟",
  setOnlineUsersCount: () => {},
})

export function OnlineUsersCountProvider({ children }: PropsWithChildren) {
  const [onlineUsersCount, setOnlineUsersCount] = useState<"؟" | number>("؟")

  return (
    <OnlineUsersCountContext.Provider value={{ onlineUsersCount, setOnlineUsersCount }}>
      {children}
    </OnlineUsersCountContext.Provider>
  )
}

export const useOnlineUsersCountContext = () => useContext(OnlineUsersCountContext)
