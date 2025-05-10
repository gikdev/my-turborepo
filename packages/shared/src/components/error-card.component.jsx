import { Heading, Hr } from "@/components"
import { ErrorBoundary } from "react-error-boundary"
import tw from "tailwind-styled-components"

const StyledContainer = tw.div`
  bg-reddark-2 border-2 border-reddark-6 
  p-4 flex flex-col gap-4 text-reddark-11
  rounded-lg max-w-72 text-center 
`

export function ErrorCard() {
  return (
    <StyledContainer>
      <Heading as="h2" size={2}>
        خطا!
      </Heading>
      <Hr className="bg-reddark-6" />
      <p>یه مشکلی پیش اومده و به احتمال زیاد تقصیر ماست. میتوانید به مسئول مربوطه پیام دهید.</p>
      {/* <p className="flex gap-2 items-center justify-center" dir="ltr">
        <Envelope size={24} />
        <a className="underline" href="https://eitaa.com/wd_bahrami">
          @wd_bahrami
        </a>
      </p> */}
    </StyledContainer>
  )
}

export function ErrorCardBoundary({ children, ...rest }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorCard} {...rest}>
      {children}
    </ErrorBoundary>
  )
}
