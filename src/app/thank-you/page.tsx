'use client';
import ImageSlider from '@/components/ImageSlider';
import LoadingPage from '@/components/LoadingPage';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { fetcher } from '@/hooks/fetcher';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/hooks/utils';
import Link from '@mui/material/Link';
import { FileInterface } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { Suspense, useEffect } from 'react';
const Page = () => {
  const { items, clearCart } = useCart();
  const totalPrice = items.reduce((acc, item) => acc + item.listing.price, 0);
  const { data } = useQuery<FileInterface[]>({
    queryKey: ['files'],
    queryFn: () => fetcher(`/api/files`),
  });
  const allFileIds = items.map(item => item.listing.fileIds).flat();
  const files = data?.filter(file => allFileIds.includes(file.id));

  return (
    files && (
      <Suspense fallback={<LoadingPage />}>
        <MaxWidthWrapper>
          <main className='relative lg:min-h-full p-4'>
            <div className='hidden lg:block h-60 overflow-hidden lg:absolute lg:h-full lg:mr-5 lg:w-1/2 lg:pr-4 xl:pr-12'>
              <Image
                fill
                src='/checkout-thank-you.jpg'
                className='h-full w-full object-cover object-center'
                alt='thank you for your order'
              />
            </div>

            <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24'>
              <div className='lg:col-start-2'>
                <p className='text-sm font-medium text-blue-600'>Order successful</p>
                <h1 className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
                  Thanks for ordering
                </h1>

                <p className='mt-2 text-base text-muted-foreground'>
                  Your order was processed and your assets are available to download below. We&apos;ve sent your receipt
                  and order details to
                </p>

                <div className='mt-16 text-sm font-medium'>
                  <ul className='mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground'>
                    {items.map(item => {
                      return (
                        <li key={item.listing.id} className='flex space-x-6 py-6'>
                          <div className='relative h-24 w-24'>
                            <ImageSlider images={item.images} />
                          </div>

                          <div className='flex-auto flex flex-col justify-between'>
                            <div className='space-y-1'>
                              <h3 className='text-gray-900'>{item.listing.name}</h3>

                              <p className='my-1'>Category: {item.listing.tag}</p>
                            </div>

                            <a
                              href={files.find(file => item.listing.fileIds.includes(file.id))?.fileUrl}
                              download
                              className='text-blue-600 hover:underline underline-offset-2'
                            >
                              Download asset
                            </a>
                          </div>

                          <p className='flex-none font-medium text-gray-900'>{formatPrice(item.listing.price)}</p>
                        </li>
                      );
                    })}
                  </ul>

                  <div className='space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground'>
                    <div className='flex justify-between'>
                      <p>Subtotal</p>
                      <p className='text-gray-900'>{formatPrice(totalPrice)}</p>
                    </div>
                  </div>

                  <div className='mt-16 border-t border-gray-200 py-6 text-right'>
                    <Link
                      onClick={() => clearCart()}
                      href='/products'
                      className='text-sm font-medium text-blue-600 hover:text-blue-500'
                    >
                      Continue shopping &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </MaxWidthWrapper>
      </Suspense>
    )
  );
};

export default Page;
