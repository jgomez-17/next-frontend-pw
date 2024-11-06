import type { Metadata } from "next";
import dynamic from 'next/dynamic'

const Navbar = dynamic(() => import('../components/menu-bar/menu-bar'), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Prontowash App",
  description: "homepages",
};


export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <main className="h-screen flex flex-col">
        <Navbar />
        <section className="main w-[96%] max-md:w-full p-2 rounded-md" style={{ minHeight: 'calc(100vh - 100px)', margin: '1rem auto' }}>{children}</section>       
      </main>
    </>
  );
}

