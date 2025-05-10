import { getFileDLURL } from "@/helpers"
import { useEffect, useState } from "react"

export function GUIDLink({ guid, ...others }) {
  const [url, setUrl] = useState<string>()
  const Tag = url ? "a" : "span"

  useEffect(() => {
    if (!guid) {
      setUrl("")
      return
    }

    getFileDLURL(guid)
      .then(url => setUrl(url))
      .catch(() => setUrl(""))
  }, [guid])

  return (
    <Tag href={url} {...others}>
      {Tag === "a" ? "دانلود" : "ندارد"}
    </Tag>
  )
}
