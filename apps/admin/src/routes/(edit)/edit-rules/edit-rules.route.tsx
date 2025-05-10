import { Btn, Textarea } from "@/components"
// @ts-ignore
import { useInEveryPage } from "@/hooks"
import { HeadingLine } from "@/layouts"
import { ArrowCounterClockwise } from "@phosphor-icons/react"
import { apiClient } from "@repo/shared/services/api-client"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import { type MasterInfo, getMasterInfoConfig, props, saveKey } from "../shared.js"

export function EditRules() {
  useInEveryPage()
  const [rules, setRules] = useState("")
  const masterInfoRes = apiClient.useFetch<MasterInfo>(getMasterInfoConfig)

  useEffect(() => {
    if (!masterInfoRes.data) return
    const loadedRules = masterInfoRes.data?.rulls
    setRules(loadedRules)
  }, [masterInfoRes.data])

  const handleSave = () => saveKey("Rulls", rules, () => Cookies.set("rulls", rules))

  return (
    <HeadingLine title="ثبت قوانین" {...props.container}>
      <Textarea {...props.textarea} value={rules} onChange={e => setRules(e.target.value)} />

      <div {...props.btnContainer}>
        <Btn
          icon={ArrowCounterClockwise}
          {...props.btnReload}
          onClick={() => masterInfoRes.reload()}
        >
          تازه سازی
        </Btn>
        <Btn onClick={handleSave} {...props.btnPrimary}>
          ثبت
        </Btn>
      </div>
    </HeadingLine>
  )
}
