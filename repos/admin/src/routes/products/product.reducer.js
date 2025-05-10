import { captureException } from "@sentry/react"
import { current, produce } from "immer"
import Cookies from "js-cookie"
import { toast } from "react-toastify"
import { Actions } from "./product.action"

const token = Cookies.get("ttkk")

export const reducerGen = invoke => (state, action) =>
  produce(state, draft => {
    const isTypeOf = (...types) => types.flat().includes(action.type)

    if (isTypeOf(Actions.SetAll)) return action.all

    if (isTypeOf(Actions.UpdatePrice)) {
      const { stockID, newPrice, priceType, date } = action
      const targetStockIndex = draft.findIndex(product => product.id === stockID)
      if (draft[targetStockIndex]) {
        draft[targetStockIndex][priceType] = Number(newPrice)
        draft[targetStockIndex].dateUpdate = date
      }
    }

    const index = action.index
    const isIndexNotValid = index === undefined || index < 0 || index >= state.length
    if (isIndexNotValid) return

    const id = state[index].id

    if (isTypeOf(Actions.DeleteItem)) draft.splice(index, 1)
    if (isTypeOf(Actions.ChangeA11y)) {
      draft[index].status = Number(action.newMode)

      const productData = current(draft[index])
      action.cb(id, productData)
    }

    const step = state[index].priceStep
    const diffStep = state[index].diffPriceStep

    if (isTypeOf(Actions.Price)) {
      if (isTypeOf(Actions.IncPrice))
        draft[index].price = draft[index].price + step >= 0 ? draft[index].price + step : 0

      if (isTypeOf(Actions.DecPrice))
        draft[index].price = draft[index].price - step >= 0 ? draft[index].price - step : 0

      if (isTypeOf(Actions.EditPrice))
        draft[index].price = action.newPrice < 0 ? 0 : action.newPrice

      invoke("UpdatePrice", token, id, draft[index].price, "price").catch(err => {
        captureException(err)
        toast.error("یه مشکلی پیش آمد (E-BIO9465)؛ اتصال‌تان به سرور برقرار هست؟")
      })
    }

    if (isTypeOf(Actions.SellDiff)) {
      if (isTypeOf(Actions.IncSellDiff))
        draft[index].diffSellPrice =
          draft[index].diffSellPrice + diffStep >= 0 ? draft[index].diffSellPrice + diffStep : 0

      if (isTypeOf(Actions.DecSellDiff))
        draft[index].diffSellPrice =
          draft[index].diffSellPrice - diffStep >= 0 ? draft[index].diffSellPrice - diffStep : 0

      if (isTypeOf(Actions.EditSellDiff))
        draft[index].diffSellPrice = action.newPrice < 0 ? 0 : action.newPrice

      invoke("UpdatePrice", token, id, draft[index].diffSellPrice, "diffSellPrice").catch(err => {
        captureException(err)
        toast.error("یه مشکلی پیش آمد (E-BIO9466)؛ اتصال‌تان به سرور برقرار هست؟")
      })
    }

    if (isTypeOf(Actions.BuyDiff)) {
      if (isTypeOf(Actions.IncBuyDiff))
        draft[index].diffBuyPrice =
          draft[index].diffBuyPrice + diffStep >= 0 ? draft[index].diffBuyPrice + diffStep : 0

      if (isTypeOf(Actions.DecBuyDiff))
        draft[index].diffBuyPrice =
          draft[index].diffBuyPrice - diffStep >= 0 ? draft[index].diffBuyPrice - diffStep : 0

      if (isTypeOf(Actions.EditBuyDiff))
        draft[index].diffBuyPrice = action.newPrice < 0 ? 0 : action.newPrice

      invoke("UpdatePrice", token, id, draft[index].diffBuyPrice, "diffBuyPrice").catch(err => {
        captureException(err)
        toast.error("یه مشکلی پیش آمد (E-BIO9467)؛ اتصال‌تان به سرور برقرار هست؟")
      })
    }
  })
