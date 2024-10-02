
import { useState } from 'react';
import { Spin } from '@/app/components/ui/iconos';
import { Button } from '@/components/ui/button';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const LogoutButton = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);

    Cookies.remove('token');
    Cookies.remove('rol')
    Cookies.remove('username')
    
    router.replace('/principalPage')
    setLoading(false);
  };

  return (
    <Button 
      onClick={handleLogout}
      variant={'destructive'}
      className='flex h-9 w-28'
      >
        {loading ? (
            <span className="flex items-center justify-center gap-3">
                <Spin />
            </span>
        ) : (
            'Cerrar sesión'
        )}
    </Button>
  );
};

export default LogoutButton;
