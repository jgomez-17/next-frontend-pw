import { useState, useEffect } from "react"
import { PerfilIcon2, PerfilIconOutline } from "@/app/components/ui/iconos"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import LogoutButton from '@/app/login/logoutButton'
import Cookies from 'js-cookie'


export function ProfileMenu() {
  const [isMounted, setIsMounted] = useState(false)
  const [rol, setRol] = useState<string | null>(null)

  useEffect(() => {
    setIsMounted(true)
    setRol(Cookies.get('rol') || null)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="rounded-none hover:bg-gray-200 px-8 w-10 m-4 p-0 focus:border-none">
            <PerfilIcon2 />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-1 z-50">
        <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className=" pointer-events-none">
            {rol && <p className="capitalize font-medium text-blue-600">{rol}</p> }
            <DropdownMenuShortcut>⇧⌘</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
  
        {/* <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            New Team
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <div className="h-8">
            <LogoutButton />
            <DropdownMenuShortcut>⇧⌘</DropdownMenuShortcut>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
