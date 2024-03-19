'use server';
import { revalidatePath } from 'next/cache';
import { db } from '@/libs/db';
import { FullListingType } from '@/app/products/[userId]/_components/ProductPageContent';
import { File, Image } from '@prisma/client';
export const updateListing = async (
  inputData: FullListingType,
  newImages?: Pick<Image, 'name' | 'imageUrl' | 'userId'>[],
  newFiles?: Pick<File, 'name' | 'fileUrl' | 'userId'>[],
) => {
  try {
    const updateListingResult = await db.listing.update({
      where: {
        id: inputData.id,
      },
      data: {
        name: inputData.name,
        userId: inputData.userId,
        tag: inputData.tag,
        description: inputData.description,
        createdAt: inputData.createdAt,
        updatedAt: new Date().toISOString(),
      },
    });
    const updateImagesResult = await db.image.updateMany({
      data: inputData.images,
    });
    const updateFilesResult = await db.file.updateMany({
      data: inputData.files,
    });

    console.log(updateListingResult);
    console.log(updateImagesResult);
    console.log(updateFilesResult);
    revalidatePath(`/products/${inputData.userId}`);
    return {
      updateListingResult: updateListingResult,
      updateImagesResult: updateImagesResult,
      updateFilesResult: updateFilesResult,
    };
  } catch (e) {
    console.log(e);
    return {
      error: 'Error creating product listing. Please try again.',
    };
  }
};
