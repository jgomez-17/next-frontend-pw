'use client'

import { useState, useEffect } from "react"
import { ArrowBotton, ArrowTop, ProfileIcon2 } from "@/app/components/ui/iconos"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
    <DropdownMenu open={menuOpen} onOpenChange={handleMenuToggle}>
      <DropdownMenuTrigger asChild className="">
        <Button className={`rounded-full bg-white/5 text-gray-300 h-9 px-1 items-center outline outline-slate-500/10 flex gap-2 max-md:gap-1 ${
            menuOpen ? "bg-white/10" : "hover:bg-slate-500/10"
          }`}>
            <ProfileIcon2 />
            {rol && <p className="capitalize max-md:hidden font-medium">{rol}</p> }
            {menuOpen ? <ArrowTop /> : <ArrowBotton />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36 mt-1.5 z-50 tracking-tight">
        <DropdownMenuLabel className="text-center">Mi cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="m-auto w-max gap-2 flex flex-col">
            {rol && <p className="capitalize cursor-default font-medium text-sm text-center text-blue-600 md:hidden">{rol}</p> }
            <LogoutButton />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}