import { captureException } from "@sentry/react"
import Cookies from "js-cookie"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import { currentUrlName, urls } from "../../stuffer.config.json"
import { logOut } from "../helpers"
import {
  comment,
  dayReport,
  file,
  ip,
  leave,
  notification,
  project,
  reward,
  statusTask,
  task,
  templateReward,
  user,
  validation,
  weeklySchedule,
} from "./swagger"

const BASE_URL = urls[currentUrlName]

const apiClientSwaggerConfig = {
  validation,
  user,
  dayReport,
  weeklySchedule,
  leave,
  reward,
  templateReward,
  notification,
  project,
  statusTask,
  task,
  comment,
  file,
  ip,
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export interface APIDataWrapper<T = any> {
  data: T
  status: string
  message: string[]
}

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

export const ERROR_MSGS: Record<string | number, string> = {
  400: "درخواست نامعتبر، لطفاً ورودی را بررسی کنید.",
  401: "دسترسی غیرمجاز؛ لطفاً دوباره وارد شوید.",
  403: "ممنوع؛ شما اجازه دسترسی ندارید.",
  404: "یافت نشد، لطفاً آدرس را بررسی کنید.",
  408: "زمان درخواست تمام شد، لطفاً دوباره تلاش کنید.",
  409: "تضاد؛ داده‌ای که تلاش می‌کنید ایجاد کنید از قبل وجود دارد.",
  422: "خطای اعتبارسنجی؛ لطفاً داده‌های ارائه‌شده را بررسی کنید.",
  500: "خطای سرور، لطفاً بعداً دوباره تلاش کنید.",
  501: "پیاده‌سازی نشده؛ سرور از این قابلیت پشتیبانی نمی‌کند.",
  502: "دروازه بد؛ سرور در اتصال به خدمات بالادستی مشکل دارد.",
  503: "سرویس در دسترس نیست؛ لطفاً بعداً دوباره تلاش کنید.",
  504: "زمان اتصال در دروازه تمام شد؛ سرور خیلی طول کشید تا پاسخ دهد.",
  GENERAL: "خطای ناشناخته؛ لطفاً بعداً دوباره تلاش کنید. (ممکن است به دلیل استفاده از فیلترشکن باشد)",
  GENERAL_SIMPLE: "خطای ناشناخته؛ لطفاً بعداً دوباره تلاش کنید.",
  NETWORK: "خطای شبکه؛ مطمئن شوید که به اینترنت متصل هستید.",
  PARSE: "تجزیه پاسخ سرور ناموفق بود؛ لطفاً دوباره تلاش کنید.",
  TIMEOUT: "زمان درخواست تمام شد؛ لطفاً دوباره تلاش کنید.",
}

type ErrorMsgKey = keyof typeof ERROR_MSGS

const defaultHeaderConfig = {
  auth: true,
  contentType: true,
}

interface APIClientFetchOptions<OutputData, RawData> {
  endpoint: string
  method?: HTTPMethod | string
  body?: string | FormData | (() => string | FormData)
  additionalHeaders?: Record<string, string>
  queryParams?: Record<string, string | number>
  headersConfig?: {
    contentType?: boolean
    auth?: boolean
  }
  permissionGiver?(): boolean
  onSuccess?(data: OutputData): void
  onError?(error?: string): void
  onFinally?(): void
  onBeforeStart?(): void
  dataTransformer?: (input: RawData) => OutputData
  fessionHandler?: () => OutputData | undefined | null
  returnRes?: boolean
  returnData?: boolean
  isLoginForm?: boolean
}

async function apiClientFetch<OutputData, RawData = unknown>({
  endpoint,
  method = "GET",
  body,
  queryParams,
  headersConfig = defaultHeaderConfig,
  additionalHeaders,
  permissionGiver = () => true,
  onError = err => toast.error(err),
  onSuccess = () => {},
  onFinally = () => {},
  onBeforeStart,
  dataTransformer,
  fessionHandler,
  returnRes = false,
  returnData = false,
  isLoginForm = false,
}: APIClientFetchOptions<OutputData, RawData>) {
  // URL
  let url = `${BASE_URL}/api${endpoint}`

  // Query parameters
  if (queryParams) {
    // Convert `{ num: 1, color: "red" }` to "num=1&color=red"
    const parsedParams = new URLSearchParams(
      Object.fromEntries(Object.entries(queryParams).map(([key, value]) => [key, String(value)])),
    ).toString()
    url += `?${parsedParams}`
  }

  // Headers
  const headers: HeadersInit = {
    ...(headersConfig.auth && { Authorization: `Bearer ${Cookies.get("ttkk")}` }),
    ...(headersConfig.contentType && { "Content-Type": "application/json" }),
    ...additionalHeaders,
  }

  // Fetch options
  const fetchOptions: RequestInit = {
    method,
    headers,
    body: typeof body === "function" ? body() : body,
  }

  const allowedToContinue = permissionGiver?.()
  if (!allowedToContinue) return

  try {
    onBeforeStart?.()
  } catch (err) {
    captureException(err)
    console.error("onBeforeStart ERROR!!!", err)
    onError?.(ERROR_MSGS.GENERAL)
  }

  try {
    const fessionData = fessionHandler?.()

    if (fessionData) {
      try {
        onSuccess?.(fessionData)
      } catch (err) {
        captureException(err)
        console.error("onSuccess ERROR!!!", err)
        onError?.(ERROR_MSGS.GENERAL)
      }
    }
  } catch (err) {
    captureException(err)
    console.error("fessionHandler ERROR!!!", err)
    onError?.(ERROR_MSGS.GENERAL)
  }

  try {
    const res = await fetch(url, fetchOptions)

    if (returnRes) return res
    const isJSONType = (res.headers.get("Content-Type") || "").includes("application/json")

    if (!res.ok) {
      const errorBody: string | APIDataWrapper<OutputData> = isJSONType
        ? await res.json()
        : await res.text()

      let errorMsg =
        typeof errorBody === "string"
          ? errorBody
          : errorBody.message?.[0] || ERROR_MSGS[res.status as ErrorMsgKey] || ERROR_MSGS.GENERAL
      errorMsg = errorMsg.trim() === "" ? ERROR_MSGS.GENERAL_SIMPLE : errorMsg

      if (res.status === 401) {
        if (isLoginForm) {
          onError?.("نام کاربری یا رمز عبور اشتباه است")
          return
        }

        logOut()
        console.warn("logout!")
      }

      captureException(errorMsg)
      onError?.(errorMsg)
      console.error(errorMsg)
      return
    }

    try {
      if (dataTransformer) {
        const rawData = (isJSONType ? await res.json() : await res.text()) as RawData

        try {
          const transformedData = dataTransformer(rawData)

          try {
            onSuccess?.(transformedData)
          } catch (err) {
            captureException(err)
            console.error("onSuccess ERROR!!!", err)
            onError?.(ERROR_MSGS.GENERAL)
          }
        } catch (err) {
          captureException(err)
          console.error("Data transformation ERROR!!!", err)
          onError?.(ERROR_MSGS.GENERAL)
        }
      } else {
        const data = (isJSONType ? await res.json() : await res.text()) as OutputData

        try {
          onSuccess?.(data)
          if (returnData) return data
        } catch (err) {
          captureException(err)
          console.error("onSuccess ERROR!!!", err)
          onError?.(ERROR_MSGS.GENERAL)
        }
      }

      return
    } catch (err) {
      captureException(err)
      console.error(err)
      onError?.(ERROR_MSGS.PARSE)
      return
    }
  } catch (err) {
    captureException(err)
    console.error(err)
    if (err instanceof TypeError) {
      if (err.name === "AbortError") {
        console.warn("Request was aborted...")
        return
      }
      if (err.message === "Failed to fetch") {
        onError?.(ERROR_MSGS.NETWORK)
        return
      }
      if (err.message.includes("timeout")) {
        onError?.(ERROR_MSGS.TIMEOUT)
        return
      }
      onError?.(ERROR_MSGS.GENERAL)
    }

    onError?.(ERROR_MSGS.GENERAL)
    return
  } finally {
    try {
      onFinally?.()
    } catch (err) {
      captureException(err)
      console.error("onFinally ERROR!!!", err)
      onError?.(ERROR_MSGS.GENERAL)
    }
  }
}

enum FetchStatus {
  Idle = "idle",
  Success = "success",
  Error = "error",
  Loading = "loading",
}

interface APIClientFetchHookOptions<OutputData, RawData>
  extends APIClientFetchOptions<OutputData, RawData> {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  depsArray?: any[]
  defaultValue?: OutputData
}

function useAPIClientFetch<OutputData, RawData = unknown>(
  optionsFn: () => APIClientFetchHookOptions<OutputData, RawData>,
) {
  const optionsRef = useRef(optionsFn())
  optionsRef.current = optionsFn()
  const [fetchStatus, setFetchStatus] = useState(FetchStatus.Idle)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [outputData, setOutputData] = useState<OutputData | undefined>(
    optionsRef.current.defaultValue,
  )
  const isLoading = fetchStatus === FetchStatus.Loading
  const isSuccess = fetchStatus === FetchStatus.Success
  const isError = fetchStatus === FetchStatus.Error
  const isFull = isSuccess && Array.isArray(outputData) && !!outputData.length
  const isEmpty = isSuccess && Array.isArray(outputData) && !outputData.length

  const fetchData = useCallback(() => {
    setFetchStatus(FetchStatus.Loading)
    setErrorMsg(null)

    apiClientFetch<OutputData, RawData>({
      ...optionsRef.current,
      onError: err => {
        setFetchStatus(FetchStatus.Error)
        setErrorMsg(err ?? "")
        optionsRef.current.onError?.(err ?? "")
      },
      onSuccess: data => {
        setFetchStatus(FetchStatus.Success)
        setOutputData(data)

        try {
          optionsRef.current.onSuccess?.(data)
        } catch (err) {
          console.error("onSuccess ERROR!!!", err)
          optionsRef.current.onError?.(ERROR_MSGS.GENERAL)
        }
      },
    })
  }, [])

  useEffect(fetchData, [...(optionsRef.current.depsArray || [])])

  return {
    errorMsg,
    data: outputData,
    reload: fetchData,
    setData: setOutputData,
    status: {
      status: fetchStatus,
      isLoading,
      isSuccess,
      isError,
      isFull,
      isEmpty,
    },
  }
}

export const apiClient = {
  fetch: apiClientFetch,
  useFetch: useAPIClientFetch,
  swagger: apiClientSwaggerConfig,
}
