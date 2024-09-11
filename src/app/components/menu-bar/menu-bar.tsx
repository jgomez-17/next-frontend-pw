'use client'

import { Menubar} from "@/components/ui/menubar"
import Link from "next/link"
import { ProfileMenu } from '@/app/views/navbar/profile-menu';
import { Ajustes, ChartIcon4, Grap, Home, MultipleUsers, SettingsIcon5, UserSettings, UsersIcon4 } from "../ui/iconos";
import { MenuApps } from "@/app/views/navbar/menu/menu-apps";
import { usePathname } from "next/navigation" // Importa el hook correcto
import Image from "next/image";
  
  export function MenubarDemo() {
    const currentPath = usePathname() // Usa el hook correcto para obtener la ruta

    return (
      <Menubar className="bg-white/50 backdrop-filter backdrop-blur-sm border-none rounded-none z-50 w-full h-12 flex justify-between fixed px-0">
        {/* <MenuLateral /> */}
        <nav className="flex w-full justify-between items-center max-h-12 gap-4 p-0">
          <MenuApps />
          <Link href={'/views'} className="flex md:ml-4 items-center gap-1 hover:text-slate-500">
            <Image
              src="/prontowash-img.png"
              width={140}
              height={500}
              alt="Picture of the author"
              className="md:hidden"
              />
              <span className="font-extrabold text-[22px] tracking-tighter text-sky-900 hover:text-slate-500 max-md:hidden">
                PW
              </span>
              <span className="font-extrabold text-xl max-md:hidden">|</span>
              <span className="font-bold text-[22px] tracking-wider max-md:hidden">
               Admin 
              </span>
            </Link>
          <ul className="items-center text-sm flex max-md:hidden">
            <li>
              <Link
                  href="/views"
                  className={`w-full rounded flex px-5 h-11 items-center gap-2 hover:bg-slate-600/5 ${
                    currentPath === "/views" ? "bg-slate-100 text-blue-800" : ""
                  }`}
                >
                <Home />
                <span className="hidden"> Inicio </span>
              </Link>
            </li>
            <li>
              <Link
                  href="/views/estadisticas"
                  className={`w-full rounded flex px-5 h-11 items-center gap-2 hover:bg-slate-600/5 ${
                    currentPath === "/views/estadisticas" ? "bg-slate-100 text-blue-800" : ""
                  }`}
                >
                <Grap />
                <span className="hidden">
                  Estadisticas
                </span>
              </Link>
            </li>
            <li>
              <Link
                  href="/views/ajustes"
                  className={`w-full rounded flex px-5 h-11 items-center gap-2 hover:bg-slate-600/5 ${
                    currentPath === "/views/ajustes" ? "bg-slate-100 text-blue-800" : ""
                  }`}
                >
                <UserSettings />
                <span className="hidden">Ajustes</span>
              </Link>
            </li>
          </ul>
          <ProfileMenu />
        </nav>

      </Menubar>
    )
  }
  