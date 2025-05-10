import { useState } from "react"

// const VersionTag = ({ version, usePrefix = false }) => <Tag dir="ltr">{usePrefix ? "v" : ""}{version}</Tag>
export function VersionTag({ version, appType, usePrefix = false }) {
  const [isOn, setOn] = useState(false)

  const className = `
    fixed bottom-5 font-[monospace] opacity-50 cursor-pointer
    bg-bluedark-3 text-bluedark-11 px-2 py-1
    hover:opacity-100 active:scale-90 hover:text-lg transition-all 
    ${isOn ? "end-5" : "start-5"}
  `

  return (
    <button className={className} type="button" dir="ltr" onClick={() => setOn(p => !p)}>
      {usePrefix && "v"}
      {version}-{appType}
    </button>
  )
}
