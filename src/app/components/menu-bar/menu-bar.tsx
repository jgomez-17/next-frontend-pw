'use client'

import { useState } from "react"
import { Menubar} from "@/components/ui/menubar"
import Link from "next/link"
import { ProfileMenu } from '@/app/components/menu-bar/profile-menu';
import { Grap, Home, UserSettings,  } from "../ui/iconos";
import { usePathname } from "next/navigation"
import Image from "next/image";
import { MenuApps } from "@/app/components/menu-bar/menu-apps";
  
  export function MenubarDemo() {
    const [menuOpen, setMenuOpen] = useState(false)
    const currentPath = usePathname() // Usa el hook correcto para obtener la ruta

    return (
      <Menubar className="bg-[#0F172A] text-gray-300 font-semibold backdrop-filter backdrop-blur-sm border-none rounded-none z-50 w-full h-14 flex justify-between fixed px-0">
        <nav className="flex w-full justify-between items-center max-h-12 gap-4 p-0 px-4">
          <MenuApps />
          <h1 className="text-2xl font-bold tracking-tighter">Logo</h1>
          <ul className="items-center gap-2 text-sm flex max-md:hidden">
            <li>
              <Link
                  href="/views"
                  className={`w-full rounded-xl flex px-5 h-10 items-center gap-2 hover:text-white ${
                    currentPath === "/views" ? "bg-white/10 text-white" : ""
                  }`}
                >
                {/* <Home /> */}
                <span className=""> Inicio </span>
              </Link>
            </li>
            <li>
              <Link
                  href="/views/estadisticas"
                  className={`w-full rounded-xl flex px-5 h-10 items-center gap-2 hover:text-white ${
                    currentPath === "/views/estadisticas" ? "bg-white/10 text-white" : ""
                  }`}
                >
                {/* <Grap /> */}
                <span className="">
                  Estadisticas
                </span>
              </Link>
            </li>
            <li>
              <Link
                  href="/views/planillas/acumulados"
                  className={`w-full rounded-xl flex px-5 h-10 items-center gap-2 hover:text-white ${
                    currentPath === "/views/planillas/acumulados" ? "bg-white/10 text-white" : ""
                  }`}
                >
                <span className="">Acumulado</span>
              </Link>
            </li>
            <li>
              <Link
                  href="/views/planillas/cierre-diario"
                  className={`w-full rounded-xl flex px-5 h-10 items-center gap-2 hover:text-white ${
                    currentPath === "/views/planillas/cierre-diario" ? "bg-white/10 text-white" : ""
                  }`}
                >
                <span className="">Cierre</span>
              </Link>
            </li>
          </ul>
          <section className="flex items-center gap-4">
          <Link
                  href="/views/ajustes"
                  className={`w-full max-md:hidden flex px-2 py-0.5 bg-white/5 rounded-full items-center gap-2 hover:text-white  ${
                    currentPath === "/views/ajustes" ? "bg-white/10 text-white" : ""
                  }`}
                >
                <UserSettings />
          </Link>
          <ProfileMenu />
          </section>
        </nav>

      </Menubar>
    )
  }
  