import { useCallback, useState } from "react"

const Modal = ({ children, dialogProps, dialogContentContainerProps }) => (
  <dialog onCancel={e => e.preventDefault()} {...dialogProps}>
    <div {...dialogContentContainerProps}>{children}</div>
  </dialog>
)

function useModal() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = useCallback(() => setIsOpen(p => !p), [])
  const closeModal = useCallback(() => setIsOpen(false), [])
  const openModal = useCallback(() => setIsOpen(true), [])
  const ModalComponent = useCallback(
    ({ children, dialogContentContainerProps, dialogProps }) =>
      isOpen ? (
        <Modal dialogProps={dialogProps} dialogContentContainerProps={dialogContentContainerProps}>
          {children}
        </Modal>
      ) : null,
    [isOpen],
  )

  return {
    Modal: ModalComponent,
    openModal,
    closeModal,
    isModalOpen: isOpen,
    toggleModal: toggleOpen,
  }
}

export { useModal }
