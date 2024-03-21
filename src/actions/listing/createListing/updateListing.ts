'use server';
import { revalidatePath } from 'next/cache';
import { db } from '@/libs/db';
import { ListingInterface } from '@prisma/client';
export const updateListing = async (inputData: ListingInterface) => {
  try {
    const updateListingResult = await db.listingInterface.update({
      where: {
        id: inputData.id,
      },
      data: {
        userId: inputData.userId,
        name: inputData.name,
        description: inputData.description,
        price: inputData.price,
        imgIds: inputData.imgIds,
        fileIds: inputData.fileIds,
        tag: inputData.tag,
        status: inputData.status,
        createdAt: inputData.createdAt,
        updatedAt: new Date(),
      },
    });
    revalidatePath(`/products/${inputData.userId}`);
    return updateListingResult;
  } catch (e) {
    console.log(e);
    return {
      error: 'Error Updating product listing. Please try again.',
    };
  }
};
