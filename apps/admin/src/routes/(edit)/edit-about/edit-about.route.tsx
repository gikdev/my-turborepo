import { Btn, Textarea } from "@/components"
// @ts-ignore
import { useInEveryPage } from "@/hooks"
import { HeadingLine } from "@/layouts"
import { ArrowCounterClockwise } from "@phosphor-icons/react"
import { apiClient } from "emex-shared/services/api-client"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import { type MasterInfo, getMasterInfoConfig, props, saveKey } from "../shared.js"

export function EditAbout() {
  useInEveryPage()
  const [aboutUs, setAboutUs] = useState("")
  const masterInfoRes = apiClient.useFetch<MasterInfo>(getMasterInfoConfig)

  useEffect(() => {
    if (!masterInfoRes.data) return
    const loadedAboutUs = masterInfoRes.data?.aboutUs
    setAboutUs(loadedAboutUs)
  }, [masterInfoRes.data])

  const handleSave = () => saveKey("AboutUs", aboutUs, () => Cookies.set("aboutUs", aboutUs))

  return (
    <HeadingLine title="ثبت درباره ما" {...props.container}>
      <Textarea {...props.textarea} value={aboutUs} onChange={e => setAboutUs(e.target.value)} />

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
