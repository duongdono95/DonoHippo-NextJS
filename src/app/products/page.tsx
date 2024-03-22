import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { db } from '@/libs/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import ProductCard from './_components/ProductCard';
import Link from 'next/link';
const page = async () => {
  const user = auth();
  if (!user.userId) {
    return redirect('sign-in');
  }
  const allImages = await db.imageInterface.findMany({
    where: {
      userId: user.userId,
    },
  });
  const allListings = await db.listingInterface.findMany({
    where: {
      userId: user.userId,
    },
  });

  return (
    <MaxWidthWrapper className='mb-20'>
      <h3 className='py-10' style={{ color: 'var(--primary07)' }}>
        All Available Products
      </h3>
      <div className='flex items-center justify-center flex-wrap gap-20 '>
        {allListings.map(listing => {
          const images = allImages.filter(img => listing.imgIds.includes(img.id));
          return (
            <Link key={listing.id} href={`/products/${listing.id}`}>
              <ProductCard images={images} listing={listing} />
            </Link>
          );
        })}
      </div>
    </MaxWidthWrapper>
  );
};

export default page;
