import { Btn, Textarea } from "@/components"
// @ts-ignore
import { useInEveryPage } from "@/hooks"
import { HeadingLine } from "@/layouts"
import { ArrowCounterClockwise } from "@phosphor-icons/react"
import { apiClient } from "vgold-shared/services/api-client"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import { type MasterInfo, getMasterInfoConfig, props, saveKey } from "../shared.js"

export function EditHome() {
  useInEveryPage()
  const [mainPage, setMainPage] = useState("")
  const masterInfoRes = apiClient.useFetch<MasterInfo>(getMasterInfoConfig)

  useEffect(() => {
    if (!masterInfoRes.data) return
    const loadedMainPage = masterInfoRes.data?.mainPage
    setMainPage(loadedMainPage)
  }, [masterInfoRes.data])

  const handleSave = () => saveKey("MainPage", mainPage, () => Cookies.set("mainPage", mainPage))

  return (
    <HeadingLine title="ثبت اطلاعات فروشگاه" {...props.container}>
      <Textarea {...props.textarea} value={mainPage} onChange={e => setMainPage(e.target.value)} />

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
