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
    // window.location.href = '/login'; 
  };

  return (
    <Button 
      onClick={handleLogout}
      className='flex font-sans items-center hover:text-red-700 bg-transparent hover:bg-transparent text-black text-xs gap-2 rounded-full'
      >
        Cerrar sesion
      <LogoutIcon />
    </Button>
  );
};

export default LogoutButton;
