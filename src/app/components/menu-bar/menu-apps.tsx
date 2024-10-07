'use client'

import { useState } from "react"
import { Acumulado, Grap, Home, Logout, MenuClose1, MenuOpen1, UserSettings } from "@/app/components/ui/iconos"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { usePathname } from "next/navigation"



export function MenuApps() {
  const [menuOpen, setMenuOpen] = useState(false)
  const currentPath = usePathname()


  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <DropdownMenu open={menuOpen} onOpenChange={handleMenuToggle}>
      <DropdownMenuTrigger asChild>
        <Button
          className={`rounded px-12 w-12 h-12 p-0 md:hidden ${
            menuOpen ? "bg-white/10 text-gray-300" : ""
          }`}
        >
          {menuOpen ? <MenuClose1 /> : <MenuOpen1 />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 m-0 bg-[#0F172A] text-slate-100 h-screen flex flex-col rounded-none z-50 text-center">
        <DropdownMenuGroup className="flex flex-col justify-between">
            <Link
                href="/views"
                className={`w-full flex px-6 py-2 items-center gap-2 hover:bg-slate-600/5 ${
                  currentPath === "/views" ? "bg-white/10 rounded" : ""
                }`}
              >
              <Home />
              Inicio
            </Link>
            <Link
                href="/views/estadisticas"
                className={`w-full flex px-6 py-2 items-center gap-2 hover:bg-slate-600/5 ${
                  currentPath === "/views/estadisticas" ? "bg-white/10 rounded" : ""
                }`}
              >
              <Grap />
              Estadisticas
            </Link>
  
            <Link
                href="/views/ajustes"
                className={`w-full flex px-6 py-2 items-center gap-2 hover:bg-slate-600/5 ${
                  currentPath === "/views/ajustes" ? "bg-white/10 rounded" : ""
                }`}
              >
              <UserSettings />
              Ajustes
            </Link>
            <Link
                href="/views/planillas/acumulados"
                className={`w-full flex px-6 py-2 items-center gap-2 hover:bg-slate-600/5 ${
                  currentPath === "/views/planillas/acumulados" ? "bg-white/10 rounded" : ""
                }`}
              >
              <Acumulado />
              Acumulado
            </Link>

            <Link
                href="/views/planillas/cierre-diario"
                className={`w-full flex px-6 py-2 items-center gap-2 hover:bg-slate-600/5 ${
                  currentPath === "/views/planillas/cierre-diario" ? "bg-white/10 text-white rounded" : ""
                }`}
              >
              <Logout />
              Cierre
            </Link>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
