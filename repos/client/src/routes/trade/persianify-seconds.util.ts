import { persianifyNumber } from "@/utils"

export function persianizeSeconds(seconds: number): string {
  // Ensure that we handle the edge case of 0 seconds correctly
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  // Use `padStart` to ensure a two-digit format and `persianifyNumber` to handle the Persian conversion
  const formattedHours = persianifyNumber(h.toString().padStart(2, "0"))
  const formattedMinutes = persianifyNumber(m.toString().padStart(2, "0"))
  const formattedSeconds = persianifyNumber(s.toString().padStart(2, "0"))

  // Return in the "hh:mm:ss" format
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}
