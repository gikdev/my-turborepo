import { forwardRef } from "react"

function ShowMoreBtnComponent({ children, setState, state }, ref) {
  return (
    <>
      <div className="show-more-btn-container">
        <button
          ref={ref}
          type="button"
          className="show-more-btn"
          onClick={e => {
            e.preventDefault()
            setState(!state)
          }}
        >
          {children}
        </button>
      </div>
    </>
  )
}

export const ShowMoreBtn = forwardRef(ShowMoreBtnComponent)
