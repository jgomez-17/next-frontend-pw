import { useState } from "react"
import { Ajustes, Grap, Home, MenuClose1, MenuOpen1, MenuOutline, MultipleUsers, SettingsIcon2, SettingsIcon3, SettingsIcon4, SettingsIcon5, SettingsNeon, UserSettings, UsersIcon, UsersIcon2, UsersIcon4 } from "@/app/components/ui/iconos"
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
          variant={"ghost"}
          className={`rounded-none px-12 w-12 h-12 p-0 md:hidden ${
            menuOpen ? "bg-gray-100 text-blue-600" : "hover:bg-gray-200"
          }`}
        >
          {menuOpen ? <MenuClose1 /> : <MenuOpen1 />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 h-screen flex flex-col rounded-none z-50 text-center">
        <DropdownMenuLabel>Nav</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="flex flex-col justify-between gap-1">
          <DropdownMenuItem className="hover:bg-slate-600/5 w-full p-0">
            <Link
                href="/views"
                className={`w-full flex px-3 items-center gap-2 hover:bg-slate-600/5 ${
                  currentPath === "/views" ? "bg-blue-500/5 text-blue-600 rounded" : ""
                }`}
              >
              <Home />
              Inicio
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-slate-600/5 w-full p-0 ">
            <Link
                href="/views/estadisticas"
                className={`w-full flex px-3 items-center gap-2 hover:bg-slate-600/5 ${
                  currentPath === "/views/estadisticas" ? "bg-blue-500/5 text-blue-600 rounded" : ""
                }`}
              >
              <Grap />
              Estadisticas
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-slate-600/5 w-full p-0 ">
            <Link
                href="/views/ajustes"
                className={`w-full flex px-3 items-center gap-2 hover:bg-slate-600/5 ${
                  currentPath === "/views/ajustes" ? "bg-blue-500/5 text-blue-600" : ""
                }`}
              >
              <UserSettings />
              <span>Ajustes</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-slate-600/5 w-full p-0 hidden">
            <Link
                href="/views/planillas/cierre-diario"
                className={`w-full flex px-3 py-2 items-center gap-2 hover:bg-slate-600/5 ${
                  currentPath === "/views/planillas/cierre-diario" ? "bg-blue-500/5 text-blue-600" : ""
                }`}
              >
              <span>Cierre</span>
            </Link>
          </DropdownMenuItem>

        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
