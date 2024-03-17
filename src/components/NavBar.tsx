import React from 'react';
import { Icons } from './Icons';
import { ShoppingCart, Store, StoreIcon } from 'lucide-react';
import { Button, Divider, IconButton } from '@mui/material';
import { UserButton, auth, clerkClient } from '@clerk/nextjs';
import Link from 'next/link';

const NavBar = () => {
  const user = auth();
  // console.log(user);
  // if (user && user.userId) {
  //   const getUser = async () => {
  //     const test = await clerkClient.users.getUser(user.userId);
  //     console.log(test.emailAddresses[0].emailAddress);
  //   };
  //   getUser();
  // }
  const isSeller = true;
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
            <IconButton>
              <ShoppingCart size={20} />
            </IconButton>
            <Divider orientation='vertical' variant='middle' flexItem />

            <Link href={`/sell/${user.userId}`}>
              <IconButton>
                <Store size={20} />
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
