import { ReactNode } from "react";
import Navbar from '@/app/views/navbar/page'; 
import Sidebar from '@/app/views/sidebar/sidebar';
import { cn } from "@/lib/utils"; 
import ListOrdenes from '@/app/views/dashboard/lista-ordenes/page';
import { MenubarDemo } from "../components/menu-bar/menu-bar";

interface MainLayoutProps {
  children?: ReactNode;
}

// Ajustar el layout de la aplicación
const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gray-50 pb-3">
      <section className="flex-1 flex flex-col">
        <MenubarDemo />
        {/* Main content */}
        <main className="flex-1 w-[97%] max-md:w-full m-auto mt-[4rem] max-md:mt-[3.3rem]">
          {children }
        </main>
      </section>
    </div>
  );
};

export default MainLayout;
