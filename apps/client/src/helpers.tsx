import { currentUrlName, urls } from "../stuffer.config.json"
export const baseUrl = urls[currentUrlName]
export * from "@repo/shared/helpers"
