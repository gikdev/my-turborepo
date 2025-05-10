import { handleHTTPErrors } from "../helpers"

/** A smart fetch wrapper */
async function useSmartFetch(options) {
  return await fetch(options.url, options).catch(handleHTTPErrors)
}

export { useSmartFetch }
