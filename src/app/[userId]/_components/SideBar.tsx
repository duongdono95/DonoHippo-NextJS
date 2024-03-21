'use client';
import { Collapse, List, ListItemButton, ListItemText } from '@mui/material';
import { Apple, ChevronUp } from 'lucide-react';
import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export type menuItemType = 'listings' | 'create-new' | 'media' | 'files' | 'orders';
export const menuList: menuItemType[] = ['listings', 'create-new', 'media', 'files', 'orders'];
const SideBar = ({ userId }: { userId: string }) => {
  const [open, setOpen] = React.useState(true);
  const handleClick = () => {
    setOpen(!open);
  };
  const pathName = usePathname();
  const lastSegment = pathName.split('/')[pathName.split('/').length - 1];
  return (
    <div className='h-full bg-slate-100 min-w-60 p-4'>
      <p className={'opacity-70'}>Collection</p>
      <List component='nav'>
        <ListItemButton
          onClick={handleClick}
          sx={{
            bgcolor: open ? 'var(--black005)' : 'none',
            borderRadius: '10px',
          }}
        >
          <ListItemText
            primary={
              <div className={'flex items-center gap-2'}>
                <Apple size={16} />
                <p style={{ lineHeight: '15px' }}>Selling</p>
              </div>
            }
          />
          <ChevronUp
            size={20}
            style={{
              transition: '0.5s ease-in-out',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </ListItemButton>
        <Collapse in={open} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            {menuList.map(item => (
              <Link key={item} href={`/${userId}/${item}`}>
                <ListItemButton sx={{ pl: 5, borderRadius: '10px' }}>
                  <p
                    style={{
                      color: lastSegment === item ? 'var(--primary)' : undefined,
                    }}
                    className={'font-medium'}
                  >
                    {item === 'create-new' && 'Create New'}
                    {item === 'listings' && 'Listing'}
                    {item === 'files' && 'Files'}
                    {item === 'media' && 'Media'}
                    {item === 'orders' && 'Orders'}
                  </p>
                </ListItemButton>
              </Link>
            ))}
          </List>
        </Collapse>
      </List>
    </div>
  );
};

export default SideBar;
