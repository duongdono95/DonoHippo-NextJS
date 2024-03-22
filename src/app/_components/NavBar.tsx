import { UserButton, auth } from '@clerk/nextjs';
import { Button, Divider, IconButton } from '@mui/material';
import { Store } from 'lucide-react';
import Link from 'next/link';
import { Icons } from '../../components/Icons';
import Cart from './Cart';

const NavBar = () => {
  const user = auth();
  return (
    <div
      className='sticky max-w-screen-xl flex items-center justify-between w-full mx-auto p-3 z-50'
      style={{ borderBottom: '1px solid var(--black01)' }}
    >
      <Icons.logo />
      <div>
        {user && user.userId ? (
          <div className='flex items-center justify-between p-2 gap-4'>
            <UserButton
              appearance={{
                elements: {
                  card: {
                    boxShadow: '3px 3px 10px var(--black01)',
                  },
                },
              }}
            />
            <Divider orientation='vertical' variant='middle' flexItem />
            <Cart userId={user.userId} />
            <Divider orientation='vertical' variant='middle' flexItem />

            <Link href={`/${user.userId}/listings`}>
              <IconButton>
                <Store size={22} />
              </IconButton>
            </Link>
          </div>
        ) : (
          <div className='flex items-center justify-between p-2 gap-4'>
            <Button variant='text'>
              <Link href={'/sign-in'}>Sign In</Link>
            </Button>
            <Button variant='contained'>
              <Link href={'/sign-up'} style={{ color: 'white' }}>
                Create Account
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
