import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { db } from '@/libs/db';
import ProductContent from './_components/ProductContent';

interface Props {
  params: {
    listingId: string;
  };
}

const page = async ({ params }: Props) => {
  console.log(params.listingId);
  const listings = await db.listingInterface.findMany({
    where: {
      status: 'active',
    },
  });
  const images = await db.imageInterface.findMany({
    where: {
      id: {
        in: listings.map(i => i.imgIds).flat(),
      },
    },
  });
  const listing = await db.listingInterface.findFirst({
    where: {
      id: params.listingId,
    },
  });

  const listingImages = await db.imageInterface.findMany({
    where: {
      id: {
        in: listing?.imgIds,
      },
    },
  });
  console.log(images);

  if (!listing || !listingImages)
    return (
      <MaxWidthWrapper>
        <p>Sorry, The listing was not found, please click here to return the previous page</p>
      </MaxWidthWrapper>
    );
  return <ProductContent images={images} listing={listing} listingImages={listingImages} listings={listings} />;
};

export default page;
