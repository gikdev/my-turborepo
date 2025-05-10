import { Copy } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { getFileDLURL, logOut } from "."
import { NumberRepresentor } from "../components"
import { enumToText } from "../enums"
import { PersianDate, addCommaToPrice, persianifyNumber, priceToRial, priceToToman } from "../utils"

const ReactSwal = withReactContent(Swal)
const swalert = {
  _show(titleText, html, icon, other) {
    return ReactSwal.fire({ titleText, html, icon, ...other })
  },
  message(title, desc) {
    return this._show(title, desc, "info")
  },
  success(title, desc) {
    return this._show(title, desc, "success")
  },
  warning(title, desc) {
    return this._show(title, desc, "warning")
  },
  error(title, desc) {
    return this._show(title, desc, "error")
  },
  info(title, desc) {
    return this._show(title, desc, "info")
  },
  ask(title, desc, defVal = "", inpType = "number") {
    return this._show(title, desc, "question", {
      input: inpType,
      inputValue: defVal,
      showCancelButton: true,
      confirmButtonText: "تغییر بده",
      cancelButtonText: "نه بیخیال...",
    })
  },
  confirm(title, desc) {
    return this._show(title, desc, "question", {
      showCancelButton: true,
      confirmButtonText: "آره",
      cancelButtonText: "نه!",
    })
  },
  updateApp() {
    return this._show("یه آپدیت داریم!", "این برنامه یه بروزرسانی لازم داره.", "info", {
      confirmButtonText: "آپدیت",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then(logOut)
  },
}

class TableFormat {
  constructor(key, name, format) {
    this.key = key
    this.name = name
    this.format = format ?? ""
  }
}

const formatters = {
  timeHHmmss: p => {
    const date = new Date(p.value)
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  },
  date: p => new PersianDate(p.value).toLocaleDateString(),
  debt: p => {
    const { value } = p

    const volume = value < 0 ? value * -1 : value
    const volumeToShow = priceToRial(volume, 4)

    return `${volumeToShow} ${value < 0 ? "(بدهکار)" : "(بستانکار)"}`
  },
  orderSide: p => enumToText("ORDER_SIDE", p.value),
  orderStatus: p => enumToText("ORDER_STATUS", p.value),
  productStatus: p => enumToText("PRODUCT_STATUS", p.value),
  persianComma: p => addCommaToPrice(persianifyNumber(p.value)),
  persianNumber: p => (p.value == null ? "-" : persianifyNumber(p.value)),
  rial: p => priceToRial(p.value),
  toman: p => priceToToman(p.value),
}

function DebtRepresentor({ value }) {
  function handleCopyBtnClick() {
    navigator.clipboard
      .writeText(Math.abs(Number(value.toFixed(3))))
      .then(() => toast.success("کپی شد!"))
      .catch(e => toast.error("یه اروری موقع کپی کردن پیش آمد..."))
  }

  return (
    <span className="flex gap-1 items-center">
      <NumberRepresentor enableAbsoluteMode number={value} />
      {value < 0 ? "(بدهکار)" : "(بستانکار)"}
      <button type="button" onClick={handleCopyBtnClick} className="bg-white/20 p-1 rounded-sm">
        <Copy size={20} />
      </button>
    </span>
  )
}

function AbsoluteLocaleNumberCell({ value }) {
  return <NumberRepresentor enableAbsoluteMode number={value} />
}

function GUIDLink({ data, colDef }) {
  const [dlUrl, setDlUrl] = useState()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    getFileDLURL(data[colDef.field]).then(url => {
      setDlUrl(url ? url : false)
    })
  }, [colDef.field])

  return dlUrl ? (
    <a href={dlUrl} className="text-amberdark-9 underline" download>
      دانلود
    </a>
  ) : (
    <span>-</span>
  )
}

export const cellRenderers = {
  GUIDLink,
  DebtRepresentor,
  AbsoluteLocaleNumberCell,
}

export { swalert, TableFormat, formatters }
