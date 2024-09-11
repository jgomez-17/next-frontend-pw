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
      variant={'default'}
      className='h-8 text-xs pb-2'
      >
        Cerrar sesión
    </Button>
  );
};

export default LogoutButton;
