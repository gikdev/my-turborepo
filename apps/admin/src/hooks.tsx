import notifSfx from "@/assets/notification.mp3"
// @ts-ignore
import { NumberRepresentor } from "@/components"
// @ts-ignore
import { useSignalRContext } from "@/contexts/signalr.context.jsx"
// @ts-ignore
import { getFileDLURL } from "@/helpers"
import { X } from "@phosphor-icons/react"
import { captureException } from "@sentry/react"
import Cookies from "js-cookie"
import { useCallback, useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { toast as toastify } from "react-toastify"
import { Link } from "wouter"
import * as ordersServices from "./routes/orders/orders.services.js"

function useNotifyOrders() {
  const { connectionRef, connectionState } = useSignalRContext()
  const notifIDs = useRef<Set<[notifId: string, orderId: number]>>(new Set())
  const notifSound = useWithSound(notifSfx)

  useEffect(() => {
    const connection = connectionRef.current
    if (!connection) return
    if (connectionState !== "connected") return

    connection.on("ReceiveOrder2", showNewOrderNotification)
    connection.on("Decided", (_isAccepted: unknown, orderId: number) => {
      for (const [notifId, notifOrderId] of notifIDs.current) {
        if (notifOrderId === orderId) toast.dismiss(notifId)
      }
    })

    return () => {
      connection.off("ReceiveOrder2")
      connection.off("Decided")
    }
  }, [connectionRef, connectionRef.current, connectionState])

  function handleAccept(toastId: string, orderId: number, userId: number) {
    toast.dismiss(toastId)

    ordersServices.accjectOrder(true, orderId, true, () =>
      connectionRef.current.invoke("DecideOrder", Cookies.get("ttkk"), true, orderId, userId),
    )

    toastify.success("سفارش تایید شد")
  }

  function handleReject(toastId: string, orderId: number, userId: number) {
    toast.dismiss(toastId)

    ordersServices.accjectOrder(true, orderId, false, () =>
      connectionRef.current.invoke("DecideOrder", Cookies.get("ttkk"), false, orderId, userId),
    )

    toastify.error("سفارش رد شد")
  }

  function showNewOrderNotification(
    _orderId: number,
    orderDto: {
      createDate: string
      dateComplete: string | null
      dlrCustomer: string | null
      dlrFamily: string | null
      dlrName: string | null
      dlrPhone: string | null
      id: number
      orderStatus: number
      price: number
      side: number
      stockName: string
      time: string
      tyStockID: number
      userID: number
      value: number
      volume: number
      stockUnit: number
    },
    userDisplayName: string,
  ) {
    try {
      notifSound.play()
    } catch (err) {
      captureException(err)
    }

    // if (Notification.permission === "granted") {
    //   new Notification("سفارش جدید", {
    //     badge: "/images/vgold-icon.png",
    //     body: `سفارش ${orderDto.side === 1 ? "خرید" : "فروش"} محصول ${orderDto.stockName} به مقدار ${Math.abs(orderDto.volume).toLocaleString()} ${orderDto.stockUnit === 1 ? "عدد" : "گرم"} با مظنه ${Math.abs(orderDto.price).toLocaleString()} ریال و ارزش ${Math.abs(orderDto.value).toLocaleString()} ریال توسط کاربر ${userDisplayName} دریافت شد!`,
    //     dir: "rtl",
    //     icon: "/images/vgold-icon.png",
    //     lang: "FA",
    //     requireInteraction: false,
    //     silent: false,
    //   })
    // }

    toast.custom(
      t => {
        notifIDs.current.add([t.id, orderDto.id])

        return (
          <div className="w-64 bg-slatedark-2 rounded-lg border border-slatedark-6 p-4 flex flex-col gap-4">
            <div className="hidden">{/* {notifIDs.current.add([t.id, orderDto.id])} */}</div>
            <div className="text-center flex text-slatedark-12 justify-between items-center border-b border-slatedark-6 pb-4">
              <Link className="font-bold text-xl" href="/orders">
                سفارش جدید
              </Link>

              <button
                type="button"
                onClick={() => toast.dismiss(t.id)}
                className="bg-slatedark-3 p-2 rounded-md cursor-pointer hover:bg-slatedark-4"
              >
                <X size={24} />
              </button>
            </div>

            <Link className="text-lg text-center text-slatedark-11" href="/orders">
              <span>سفارش </span>
              <strong className="text-amberdark-9">{orderDto.side === 1 ? "خرید" : "فروش"} </strong>
              <span>محصول </span>
              <strong className="text-amberdark-9">{orderDto.stockName} </strong>
              <span>به مقدار </span>
              <strong className="text-amberdark-9">
                <NumberRepresentor enableAbsoluteMode number={orderDto.volume} />{" "}
              </strong>
              <strong className="text-amberdark-9">
                {orderDto.stockUnit === 1 ? "عدد" : "گرم"}{" "}
              </strong>
              <span>با مظنه </span>
              <strong className="text-amberdark-9">
                <NumberRepresentor enableAbsoluteMode number={orderDto.price} />{" "}
              </strong>
              <strong className="text-amberdark-9">ریال </strong>
              <span>و ارزش </span>
              <strong className="text-amberdark-9">
                <NumberRepresentor enableAbsoluteMode number={orderDto.value} />{" "}
              </strong>
              <strong className="text-amberdark-9">ریال </strong>
              <span>توسط کاربر </span>
              <strong className="text-amberdark-9">{userDisplayName} </strong>
              <span>دریافت شد!</span>
            </Link>

            <div className="flex gap-2 text-lg">
              <button
                type="button"
                className="px-4 py-2 w-full bg-greendark-9 font-bold rounded-md hover:bg-greendark-10 text-white active:scale-95"
                onClick={() => handleAccept(t.id, orderDto.id, orderDto.userID)}
              >
                تایید
              </button>

              <button
                type="button"
                className="px-4 py-2 w-full border border-reddark-7 bg-reddark-3 font-bold rounded-md hover:bg-reddark-4 hover:border-reddark-8 text-white active:scale-95"
                onClick={() => handleReject(t.id, orderDto.id, orderDto.userID)}
              >
                رد
              </button>
            </div>
          </div>
        )
      },
      { position: "top-right", duration: 30 * 1000, removeDelay: 0 },
    )
  }
}

export function useInEveryPage() {
  useNotifyOrders()
}

export function useGUIDLink(guid) {
  const [url, setUrl] = useState("")

  useEffect(() => {
    if (!guid) {
      setUrl("")
      return
    }

    getFileDLURL(guid)
      .then((url: string) => setUrl(url))
      .catch(() => setUrl(""))
  }, [guid])

  return url
}

export function useWithSound(audioSource: string) {
  const soundRef = useRef(null)

  useEffect(() => {
    soundRef.current = new Audio(audioSource)
  }, [audioSource])

  const play = useCallback(() => {
    soundRef.current.play()
  }, [])

  const pause = useCallback(() => {
    soundRef.current.pause()
  }, [])

  return { play, pause }
}

// @ts-ignore
export * from "vgold-shared/hooks"
