import { captureException } from "@sentry/react"
import Cookies from "js-cookie"
import { toast } from "react-toastify"
import { apiEndpoints, swalert } from "."
import { deleteAllCookies, randomString } from "../utils"

/**
 * Gets the download URL of an upload file by getting the `GUID`
 * @param {string} GUID the GUID of the file...
 * @returns {Promise<string>} the downloadable url
 */
async function getFileDLURL(GUID) {
  if (!GUID) return ""
  try {
    const url = apiEndpoints.file.download(GUID).url
    const res = await fetch(url)
    return res.url
  } catch (e) {
    return ""
  }
}

/** Tells whether the user is logged in or not
 * @returns {boolean}
 */
const getIsLoggedIn = () => !!Cookies.get("ttkk")

/** Handles the common HTTP errors
 * @param {Error} err
 * @returns {*}
 */
function handleHTTPErrors(err) {
  captureException(err)
  console.error(err)
  const status = err.status
  switch (status) {
    case 400:
      toast.error("یه مشکلی پیش اومده...")
      return Promise.reject(new Error("An error occurred. Please try again."))
    case 401:
      toast.error("لطفا دوباره لاگین کنید.")
      setTimeout(logOut, 3000)
      return Promise.reject(new Error("Unauthorized: Please log in again."))
    case 403:
      toast.error("شرمنده ولی اجازه نداری به این دست بزنی...")
      return Promise.reject(new Error("Forbidden: You do not have permission."))
    case 404:
      toast.error("۴۰۴ پیدا نشد")
      return Promise.reject(new Error("Not Found: The requested resource was not found."))
    case status >= 500 && status < 600:
      toast.error("یه مشکلی هست که مقصرش ما هستیم... لطفا بعدا امتحان کن...")
      return Promise.reject(new Error("Server Error: Please try again later."))
    default:
      toast.error(`یه مشکلی پیش اومده... ${status} - ${err.message}`)
      return Promise.reject(new Error("An error occurred. Please try again."))
  }
}

/**
 * Uploads a file to the API
 * @async
 * @param {File} file the file to upload to server
 * @param {boolean} [isPrivate] whether the file is private or not
 * @returns {Promise<string>} Returns GUID if `isPrivate` else *adress*
 */
async function uploadFile(file, isPrivate = false) {
  const formData = new FormData()
  const fileName = file.name
  const lastDotPosition = fileName.lastIndexOf(".")
  const fileExt = fileName.slice(lastDotPosition, fileName.length)
  const conf = apiEndpoints.file.upload
  const url = conf.url
  const options = {
    method: conf.method,
    body: formData,
  }

  formData.append("File", file)
  formData.append("Name", randomString(20) + fileExt)
  formData.append("Description", "")
  formData.append("IsPrivate", isPrivate)

  try {
    const res = await fetch(url, options)
    const data = await res.json()
    return isPrivate ? data.id : data.adress
  } catch (error) {
    captureException(error)
    toast.error("ای وای...!", "مثل اینکه توی آپلود به مشکل خوردیم 🥲")
    return ""
  }
}

/** Logs the user out: deletes cookies and redirects them to login */
function logOut() {
  deleteAllCookies()
  localStorage.clear()
  sessionStorage.clear()
  location.href = "/login"
}

/** The default fetcher for SWR
 * @param {...{}} config
 * @returns {*} an async function for the SWR
 */
function fetcher(config) {
  return async url => {
    const res = await fetch(url, config)

    if (res.ok) {
      const data = await res.json()
      return data
    }

    if (res.status === 401) {
      res
        .json()
        .then(data => toast.error(`${data.msg} ${data.code ? data.code : ""}`))
        .catch(err => captureException(err))
      setTimeout(logOut, 4000)
      return
    }
    const error = new Error("An error occurred while fetching the data.")
    error.info = await res.json()
    error.status = res.status
    handleHTTPErrors(error)
    throw error
  }
}

export { getFileDLURL, getIsLoggedIn, handleHTTPErrors, uploadFile, logOut, fetcher }
