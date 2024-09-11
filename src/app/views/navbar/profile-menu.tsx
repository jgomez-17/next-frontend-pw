import { useState, useEffect } from "react"
import { PerfilIcon2, PerfilIconOutline, ProfileIcon } from "@/app/components/ui/iconos"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import LogoutButton from '@/app/(auth)/login/logoutButton'
import Cookies from 'js-cookie'


export function ProfileMenu() {
  const [isMounted, setIsMounted] = useState(false)
  const [rol, setRol] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen)
  }

  useEffect(() => {
    setIsMounted(true)
    setRol(Cookies.get('rol') || null)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <DropdownMenu onOpenChange={handleMenuToggle}>
      <DropdownMenuTrigger asChild className="">
        <Button variant={"ghost"} className={`rounded-none px-10 h-12 w-12 p-0 focus:border-none ${
            menuOpen ? "bg-gray-100" : "hover:bg-gray-200"
          }`}>
            <ProfileIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 rounded-none z-50">
        <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="">
          <DropdownMenuItem className="pointer-events-none my-2">
            {rol && <p className="capitalize font-medium text-blue-600">{rol}</p> }
            <DropdownMenuShortcut>⇧⌘</DropdownMenuShortcut>
          </DropdownMenuItem>
            <LogoutButton />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
