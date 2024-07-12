import { Button } from '@/components/ui/button';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { IoLogOut } from "react-icons/io5";
import { LogoutIcon } from '@/app/components/ui/iconos';


const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('rol')
    Cookies.remove('username')
    
    router.replace('/principalPage')
  };

  return (
    <Button 
      onClick={handleLogout}
      className='flex w-28 items-center bg-red-700 hover:bg-red-800 text-xs max-md:rounded-lg h-8'
      >
        Cerrar sesion
    </Button>
  );
};

export default LogoutButton;
