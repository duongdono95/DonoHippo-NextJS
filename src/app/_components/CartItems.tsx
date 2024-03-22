import { useCart } from '@/hooks/use-cart';
import { Button, IconButton } from '@mui/material';
import { Trash, X } from 'lucide-react';
import React from 'react';
import { formatPrice } from '../../hooks/utils';
import ImageSlider from '@/components/ImageSlider';
import { toast } from 'react-toastify';
interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
}

const CartItems = ({ setOpen, userId }: Props) => {
  const { items, removeItem } = useCart();
  const totalPrice = items.reduce((acc, item) => acc + item.listing.price, 0);
  const handleSubmit = async () => {
    toast.warning('Check out is temporary disabled for this Demo Project. you will be re-directed to final stage');
    window.location.href = '/thank-you';
    // const result = await stripeRedirect({
    //   subTotal: totalPrice,
    //   items: items.map(item => item.listing),
    //   userId: userId,
    // });
    // if (result.error) {
    //   console.log(result.error);
    //   return;
    // }
    // if (result.data) {
    //   window.location.href = result.data;
    // }
  };
  return (
    <div className={'min-w-96 p-4 h-full flex flex-col'}>
      <div className={'px-4 flex items-center justify-between'} style={{ borderBottom: '1px solid var(--primary02)' }}>
        <h3 className={'opacity-70'}>Cart</h3>
        <IconButton className={'hover:animate-spin'} onClick={() => setOpen(false)}>
          <X />
        </IconButton>
      </div>
      <div className={'flex flex-col gap-4 min-w-96 px-4 py-8 flex-1 overflow-hidden overflow-y-scroll '}>
        {items.map(item => (
          <div key={item.listing.id} className={'flex items-center justify-between gap-2'}>
            <div className={'relative w-24 h-24 rounded-md overflow-hidden'}>
              <ImageSlider images={item.images} />
            </div>
            <div className={'flex-1 '}>
              <p className={'truncate w-full opacity-70'}>{item.listing.name}</p>
              <p className={'py-2 font-medium'}>
                {item.listing.price === 0 ? 'Free' : formatPrice(item.listing.price)}
              </p>
            </div>
            <IconButton onClick={() => removeItem(item.listing.id)}>
              <Trash size={20} />
            </IconButton>
          </div>
        ))}
      </div>
      <div
        className={'flex justify-between p-4 '}
        style={{ borderTop: '1px solid var(--primary03)', borderBottom: '1px solid var(--primary03)' }}
      >
        <b className={'opacity-70'}>Subtotal:</b>
        <p className={' font-bold'} style={{ color: 'var(--primary)' }}>
          {formatPrice(totalPrice)}
        </p>
      </div>
      <Button
        disabled={items.length === 0}
        variant={'contained'}
        sx={{ margin: '30px 0' }}
        onClick={() => handleSubmit()}
      >
        Checkout
      </Button>
    </div>
  );
};

export default CartItems;
