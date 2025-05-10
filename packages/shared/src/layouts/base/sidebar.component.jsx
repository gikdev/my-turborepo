import { Btn } from "@/components"
import { useUIContext } from "@/contexts"
import { cn } from "@/helpers"
import { House, XCircle } from "@phosphor-icons/react"
import tw from "tailwind-styled-components"
import { Link, useLocation } from "wouter"

function Sidebar({ items }) {
  const { sidebar } = useUIContext()

  const asideClasses = cn(
    "overflow-y-auto border-l border-slatedark-6 bg-slatedark-1 z-10",
    "flex flex-col px-4 py-8 gap-2",
    "inset-0 w-full max-w-full",
    "md:relative md:max-w-max md:flex",
    {
      hidden: !sidebar.isOpen,
      fixed: sidebar.isOpen,
    },
  )

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <aside className={asideClasses} onClick={sidebar.close}>
      <img
        className="inline-block max-h-16 mx-auto md:hidden max-w-max"
        src="/images/vgold-full.png"
        alt=""
      />
      {items.map(item => (
        <SidebarItem key={item.id} {...item} />
      ))}
      <Btn onClick={sidebar.close} className="shrink-0 grow-0 mt-auto md:hidden" icon={XCircle}>
        بستن
      </Btn>
    </aside>
  )
}

const StyledSidebarItem = tw(Link)`
  text-slatedark-10 min-w-52 flex gap-2 py-3 px-4 rounded-lg items-center
  hover:bg-slatedark-3 hover:text-slatedark-12 active:scale-95 transition-all
`

function SidebarItem({ text = "آیتم سایدبار", icon: Icon = House, url }) {
  const [path] = useLocation()
  const isActive = path === url

  return (
    <StyledSidebarItem
      href={url}
      className={
        isActive ? "bg-amberdark-9 text-slatedark-1 hover:text-slatedark-12 hover:bg-amber-8" : ""
      }
    >
      <Icon weight={isActive ? "fill" : "regular"} size={24} />
      <span>{text}</span>
    </StyledSidebarItem>
  )
}

export { Sidebar }
