import { ReactNode } from "react";
import { MenubarDemo } from "../components/menu-bar/menu-bar";
import Navbar from "../components/menu-bar/menu-bar2";

interface MainLayoutProps {
  children?: ReactNode;
}

// Ajustar el layout de la aplicación
const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen pb-3">
      <section className="flex-1 flex flex-col">
        <MenubarDemo />
        {/* <Navbar /> */}
        {/* Main content */}
        <main className="flex-1 w-[97%] max-md:w-full m-auto mt-[4rem]">
          {children }
        </main>
      </section>
    </div>
  );
};

export default MainLayout;
