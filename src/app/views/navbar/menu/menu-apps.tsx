import { ChartIcon2, ChartIcon3, ChartIcon4, ChartNeon, MenuBold, SettingsIcon2, SettingsIcon3, SettingsIcon4, SettingsIcon5, SettingsNeon, UsersIcon, UsersIcon2, UsersIcon4 } from "@/app/components/ui/iconos"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Settings2 } from "lucide-react"
import Link from "next/link"


export function MenuApps() {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="rounded-none hover:bg-gray-200 px-8 w-10 m-4 p-0 focus:border-none">
            <MenuBold />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[460px] mt-1 z-50 h-screen text-center">
        <DropdownMenuLabel>Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="flex justify-between gap-1">
          <DropdownMenuItem className="text-gray-600 hover:bg-slate-600/5 w-full shadow-sm flex justify-center p-0">
            <Link href="/views/clientes" className="w-full flex items-center flex-col"> 
              Clientes 
              <UsersIcon4 /> 
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-gray-600 hover:bg-slate-600/5 w-full shadow-sm p-0">
            <Link href="/views/estadisticas" className="w-full flex items-center flex-col"> 
              Estadisticas 
              <ChartIcon4 /> 
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-gray-600 hover:bg-slate-600/5 w-full shadow-sm p-0">
            <Link href="/views/ajustes" className="w-full flex items-center flex-col"> 
              <span>Ajustes</span> 
              <SettingsIcon5 /> 
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
