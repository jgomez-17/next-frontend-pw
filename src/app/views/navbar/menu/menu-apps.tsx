import { useState } from "react"
import { Acumulado, Ajustes, Grap, Home, Logout, MenuClose1, MenuOpen1, MenuOutline, MultipleUsers, SettingsIcon2, SettingsIcon3, SettingsIcon4, SettingsIcon5, SettingsNeon, UserSettings, UsersIcon, UsersIcon2, UsersIcon4 } from "@/app/components/ui/iconos"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Settings2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ProfileMenu } from "../profile-menu"
import LogoutButton from '@/app/(auth)/login/logoutButton'


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
        <DropdownMenuGroup className="flex flex-col justify-between gap-3">
            <Link
                href="/views"
                className={`w-full flex px-6 items-center gap-2 hover:bg-slate-600/5 ${
                  currentPath === "/views" ? "bg-white/10 rounded" : ""
                }`}
              >
              <Home />
              Inicio
            </Link>
            <Link
                href="/views/estadisticas"
                className={`w-full flex px-6 items-center gap-2 hover:bg-slate-600/5 ${
                  currentPath === "/views/estadisticas" ? "bg-white/10 rounded" : ""
                }`}
              >
              <Grap />
              Estadisticas
            </Link>
  
            <Link
                href="/views/ajustes"
                className={`w-full flex px-6 items-center gap-2 hover:bg-slate-600/5 ${
                  currentPath === "/views/ajustes" ? "bg-white/10 rounded" : ""
                }`}
              >
              <UserSettings />
              <span>Ajustes</span>
            </Link>
            <Link
                href="/views/planillas/acumulados"
                className={`w-full flex px-6 items-center gap-2 hover:bg-slate-600/5 ${
                  currentPath === "/views/planillas/acumulados" ? "bg-white/10 rounded" : ""
                }`}
              >
              <Acumulado />
              <span>Acumulado</span>
            </Link>

            <Link
                href="/views/planillas/cierre-diario"
                className={`w-full flex px-6 items-center gap-2 hover:bg-slate-600/5 ${
                  currentPath === "/views/planillas/cierre-diario" ? "bg-white/10 text-white rounded" : ""
                }`}
              >
              <Logout />
              <span>Cierre</span>
            </Link>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
