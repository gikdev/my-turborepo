import { Btn, Heading, Hr, LastUpdated, LoadingSpinner } from "@/components"
import { useSignalRContext } from "@/contexts/signalr.context"
import { TitledCard } from "@/layouts"
import { ArrowCounterClockwise, Plus } from "@phosphor-icons/react"
import { apiClient } from "emex-shared/services/api-client"
import { useEffect, useReducer } from "react"
import tw from "tailwind-styled-components"
import { Link } from "wouter"
import { ProductCard } from "./product-card.component"
import { Actions } from "./product.action"
import { reducerGen } from "./product.reducer"
import { deleteProduct, editProduct } from "./product.services"

const StyledContainer = tw.div`flex flex-wrap gap-4 justify-center`

export function ProductsGrid() {
  const { connectionRef } = useSignalRContext()
  const invoke = (...args) => connectionRef.current.invoke(...args)
  const [products, dispatch] = useReducer(reducerGen(invoke), null)

  useEffect(() => {
    apiClient.fetch({
      endpoint: "/TyStocks",
      onSuccess: data => dispatch({ type: Actions.SetAll, all: data }),
    })
  }, [])

  const listeners = {
    deleteItem: index => {
      const isConfirmed = confirm("مطمئنی که میخوای اینو پاک کنی؟")
      if (!isConfirmed) return

      const { id } = products[index]
      deleteProduct(id, () => {
        dispatch({ type: Actions.DeleteItem, index })
      })
    },
    changeA11y: (index, newMode) => {
      dispatch({
        type: Actions.ChangeA11y,
        index,
        newMode,
        cb: editProduct,
      })
    },
    sellDiff: {
      caretUpHandler: index => dispatch({ type: Actions.IncSellDiff, index }),
      penHandler: (index, newPrice) => dispatch({ type: Actions.EditSellDiff, index, newPrice }),
      caretDownHandler: index => dispatch({ type: Actions.DecSellDiff, index }),
    },
    priceMain: {
      caretUpHandler: index => dispatch({ type: Actions.IncPrice, index }),
      penHandler: (index, newPrice) => dispatch({ type: Actions.EditPrice, index, newPrice }),
      caretDownHandler: index => dispatch({ type: Actions.DecPrice, index }),
    },
    buyDiff: {
      caretUpHandler: index => dispatch({ type: Actions.IncBuyDiff, index }),
      penHandler: (index, newPrice) => dispatch({ type: Actions.EditBuyDiff, index, newPrice }),
      caretDownHandler: index => dispatch({ type: Actions.DecBuyDiff, index }),
    },
    handlePriceChange: (stockID, newPrice, priceType, date) => {
      dispatch({
        type: Actions.UpdatePrice,
        stockID,
        newPrice,
        priceType,
        date,
      })
    },
  }

  useEffect(() => {
    if (!products) return
    connectionRef.current.on("ReceivePriceUpdate", listeners.handlePriceChange)

    const cleanup = () =>
      connectionRef.current.off("ReceivePriceUpdate", listeners.handlePriceChange)
    return cleanup
  }, [products, connectionRef, listeners.handlePriceChange])

  // Handle -> what?
  if (!Array.isArray(products) && products != null)
    return <p className="text-center">یه مشکلی هست که ارور نیست...</p>

  // Handle loading... (null only...)
  if (!products) return <LoadingSpinner className="mx-auto" />

  return (
    <StyledContainer>
      <TitledCard className="max-w-[25rem] md:max-w-[40rem] w-full min-w-max flex flex-col gap-4">
        <Heading as="h3" size={2} className="text-slatedark-12 text-center">
          مدیریت محصولات 👇🏻
        </Heading>
        <Hr className="mb-auto" />
        <Btn icon={ArrowCounterClockwise} onClick={() => location.reload()}>
          تازه سازی
        </Btn>
        <Btn icon={Plus} as={Link} theme="success" themeType="filled" href="/products/manage?new">
          محصول جدید
        </Btn>
      </TitledCard>
      {products?.length ? (
        products.map((product, i) => (
          <ProductCard
            key={product.id}
            id={product.id}
            index={i}
            listeners={listeners}
            name={product.name}
            status={product.status}
            dateText={<LastUpdated dateStr={product.dateUpdate} />}
            priceMain={product.price}
            buyDiff={product.diffBuyPrice}
            sellDiff={product.diffSellPrice}
          />
        ))
      ) : (
        <p className="text-center">فعلا محصولی اینجا نیست...</p>
      )}
    </StyledContainer>
  )
}
