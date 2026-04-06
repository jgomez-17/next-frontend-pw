import dynamic from 'next/dynamic'
import LoginPage from "./(auth)/login/page";
import SeccionClientes from '../app/(auth)/clientes/page'
import Image from 'next/image';

// Cargar dinámicamente los componentes con SSR deshabilitado
// const SeccionClientes = dynamic(() => import('../clientes/page'), { ssr: false });
// const Login = dynamic(() => import('../login/page'), { ssr: false });


export default function Home () {

  return (
   <>
    <main className='flex m-auto h-screen'>
        <section className='w-max flex flex-col gap-4 m-auto'>
          <Image
            priority
            src="/pwlogo.png"
            alt='logo'
            width={300}
            height={300}
          />
          <LoginPage />
          <SeccionClientes />
        </section>

    </main>
   </>
  );
}
