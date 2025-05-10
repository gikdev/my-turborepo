import { createContext, type PropsWithChildren, useCallback, useContext, useState } from "react"

interface UIContext {
  sidebar: {
    isOpen: boolean
    open(): void
    close(): void
  }
}

const UIContext = createContext<UIContext>({
  sidebar: {
    isOpen: false,
    open: () => {},
    close: () => {},
  },
})

export const useUIContext = () => useContext(UIContext)

export function UIProvider({ children }: PropsWithChildren) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const openSidebar = useCallback(() => setIsSidebarOpen(true), [])
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), [])
  const sidebar = {
    isOpen: isSidebarOpen,
    open: openSidebar,
    close: closeSidebar,
  }
  const value = { sidebar }

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}
