import { useEffect } from "react"
import { Signaler } from "../helpers"

const useSignaler = () => new Signaler()
const useListen = (signaler, name, action) =>
  useEffect(() => signaler.listen(name, action), [signaler, name, action])

export { useSignaler, useListen }
