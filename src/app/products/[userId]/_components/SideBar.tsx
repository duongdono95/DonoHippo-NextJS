'use client';
import { Collapse, List, ListItemButton, ListItemText } from '@mui/material';
import { Apple, ChevronUp } from 'lucide-react';
import React from 'react';

import { menuItemType, productPageStore } from './store-product-page';
export const menuList: menuItemType[] = ['Products', 'Create New', 'Media', 'Files', 'Orders'];
const SideBar = () => {
  const [open, setOpen] = React.useState(true);
  const { active, setActive } = productPageStore();
  const handleClick = () => {
    setOpen(!open);
  };
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
              <ListItemButton key={item} sx={{ pl: 5, borderRadius: '10px' }} onClick={() => setActive(item)}>
                <p
                  style={{
                    color: active === item ? 'var(--primary)' : undefined,
                  }}
                  className={'font-medium'}
                >
                  {item}
                </p>
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </List>
    </div>
  );
};

export default SideBar;
