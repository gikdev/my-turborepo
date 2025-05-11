import {
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react"
import type { CustomerLoginModel } from "vgold-shared/gen-types"
import { apiClient } from "vgold-shared/services/api-client"

interface ProfileContext {
  profile: CustomerLoginModel
  setProfile: Dispatch<SetStateAction<CustomerLoginModel>>
}
const ProfileContext = createContext<ProfileContext>({
  profile: {},
  setProfile: () => {},
})

export const useProfileContext = () => useContext(ProfileContext)

export function ProfileProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = useState<CustomerLoginModel>()
  const value = { profile, setProfile }

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useGetProfileUpdater() {
  const permissionRef = useRef(false)
  const { setProfile } = useProfileContext()

  const res = apiClient.useFetch<CustomerLoginModel>(() => ({
    endpoint: "/Customer/GetProfile",
    defaultValue: {},
    permissionGiver: () => permissionRef.current,
    onSuccess(data) {
      setProfile(data)
    },
  }))

  const reload = useCallback(() => {
    permissionRef.current = true

    res.reload()
  }, [res.reload])

  return reload
}
