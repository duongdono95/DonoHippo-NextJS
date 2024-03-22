import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/hooks/utils';
import { Button, Tooltip } from '@mui/material';
import { ImageInterface, ListingInterface } from '@prisma/client';
import { ShoppingCartIcon } from 'lucide-react';
import ImageSlider from './ImageSlider';

interface Props {
  listing: ListingInterface;
  images: ImageInterface[];
}

const ProductCard = ({ listing, images }: Props) => {
  const { addItem } = useCart();
  return (
    <div className='p-2 bg-zinc-100 rounded-lg relative'>
      <div className='w-40 h-40'>
        <ImageSlider images={images} />
      </div>
      <Tooltip placement='right' title={listing.name}>
        <p className='truncate font-medium text-base px-2 pt-4 w-40'>{listing.name}</p>
      </Tooltip>
      <Tooltip placement='right' title={listing.description}>
        <p className='w-40 p-2 truncate opacity-70'>{listing.description}</p>
      </Tooltip>
      {listing.price === 0 && (
        <span className='flex w-8 h-6 absolute -top-3 -right-2 z-50'>
          <span className='animate-ping absolute inline-flex h-full w-full rounded-md bg-green-400 opacity-75'></span>
          <span
            className='relative w-8 h-6 pt-1 text-center rounded-md bg-green-600 text-white font-medium'
            style={{ fontSize: '12px' }}
          >
            Free
          </span>
        </span>
      )}
      <div className='px-2 mb-2'>
        <p style={{ color: 'var(--primary)' }} className={'py-2 font-medium'}>
          {formatPrice(listing.price)}
        </p>

        <Button
          variant={'contained'}
          sx={{ margin: '20px 0' }}
          onClick={() => addItem({ listing: listing, images: images })}
          fullWidth
        >
          Add to cart <ShoppingCartIcon size={16} style={{ marginLeft: '5px' }} />
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
