'use client'

import { useState } from "react"
import { Menubar} from "@/components/ui/menubar"
import Link from "next/link"
import { ProfileMenu } from '@/app/components/menu-bar/profile-menu';
import { UserSettings,  } from "../ui/iconos";
import { usePathname } from "next/navigation"
import { MenuApps } from "@/app/components/menu-bar/menu-apps";

  
  export function MenubarDemo() {
    const [menuOpen, setMenuOpen] = useState(false)
    const currentPath = usePathname()

    return (
      <Menubar className="bg-[#0F172A] text-gray-300 flex justify-between font-semibold border-none rounded-none z-50 w-full h-14 px-4 top-0 fixed">
          <MenuApps />
          <h1 className="text-2xl font-bold tracking-tighter">Logo</h1>
          <ul className="items-center gap-2 text-sm flex max-md:hidden">
              <Link
                  href="/views"
                  className={`w-full rounded-xl flex px-5 h-10 items-center gap-2 hover:text-white ${
                    currentPath === "/views" ? "bg-white/10 text-white" : ""
                  }`}
                >
                <p> Inicio </p>
              </Link>
              <Link
                  href="/views/estadisticas"
                  className={`w-full rounded-xl flex px-5 h-10 items-center gap-2 hover:text-white ${
                    currentPath === "/views/estadisticas" ? "bg-white/10 text-white" : ""
                  }`}
                >
                <p> Estadisticas </p>
              </Link>
              <Link
                  href="/views/planillas/acumulados"
                  className={`w-full rounded-xl flex px-5 h-10 items-center gap-2 hover:text-white ${
                    currentPath === "/views/planillas/acumulados" ? "bg-white/10 text-white" : ""
                  }`}
                >
                <p> Acumulado </p>
              </Link>
              <Link
                  href="/views/planillas/cierre-diario"
                  className={`w-full rounded-xl flex px-5 h-10 items-center gap-2 hover:text-white ${
                    currentPath === "/views/planillas/cierre-diario" ? "bg-white/10 text-white" : ""
                  }`}
                >
                <p> Cierre </p>
              </Link>
          </ul>
          <ul className="flex items-center gap-4">
            <Link href="/views/ajustes" className={`w-full max-md:hidden flex px-2 py-0.5 bg-white/5 rounded-full items-center gap-2 hover:text-white  ${
                      currentPath === "/views/ajustes" ? "bg-white/10 text-white" : ""
                    }`}
            >
              <UserSettings />
            </Link>
            <ProfileMenu />
          </ul>
      </Menubar>
    )
  }
  