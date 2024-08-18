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
      variant={'ghost'}
      className='w-full flex justify-start font-normal p-0 hover:bg-transparent text-gray-500 rounded-none'
      >
        Cerrar sesion
    </Button>
  );
};

export default LogoutButton;
