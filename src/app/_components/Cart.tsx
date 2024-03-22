'use client';
import { ShoppingCart } from 'lucide-react';
import { Badge, Drawer, IconButton } from '@mui/material';
import React, { useState } from 'react';
import CartItems from './CartItems';
import { useCart } from '@/hooks/use-cart';

interface Props {
  userId: string;
}

const Cart = ({ userId }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { items } = useCart();
  return (
    <div>
      <Drawer open={open} anchor={'right'} onClose={() => setOpen(false)}>
        <CartItems setOpen={setOpen} userId={userId} />
      </Drawer>
      <IconButton onClick={() => setOpen(true)}>
        <Badge
          color={'primary'}
          badgeContent={<p className={'text-white'}>{items.length}</p>}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <ShoppingCart size={22} />
        </Badge>
      </IconButton>
    </div>
  );
};

export default Cart;
