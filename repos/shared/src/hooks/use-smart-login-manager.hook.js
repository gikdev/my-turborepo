import { useEffect } from "react"
import { getIsLoggedIn } from "../helpers"

/** Will redirect the user to login page if not logged in */
function useSmartLoginManager() {
  useEffect(() => {
    const isLoggedIn = getIsLoggedIn()
    if (!isLoggedIn) location.href = "/login"
  }, [])
}

export { useSmartLoginManager }
