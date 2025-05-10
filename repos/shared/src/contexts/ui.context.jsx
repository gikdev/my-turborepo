import { createContext, useCallback, useContext, useState } from "react"

const UIContext = createContext({
  sidebar: {
    isOpen: false,
    open: () => {},
    close: () => {},
  },
})
const useUIContext = () => useContext(UIContext)

function UIProvider({ children }) {
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

export { UIProvider, useUIContext }
