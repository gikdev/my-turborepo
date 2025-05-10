import tw from "tailwind-styled-components"
import { Heading } from "../components"

function TitledCard({ title = "", children, as: Tag = "section", ...other }) {
  const StyledContainer = tw(Tag)`
    px-4 py-8 rounded-xl border-2
    bg-slatedark-2 border-slatedark-6
  `

  return (
    <StyledContainer {...other}>
      {title && (
        <Heading as="h1" size={3} className="text-slatedark-11 mb-4 text-center">
          {title}
        </Heading>
      )}
      {children}
    </StyledContainer>
  )
}

export { TitledCard }
