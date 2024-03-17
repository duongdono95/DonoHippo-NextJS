'use server';
import { revalidatePath } from 'next/cache';
import { db } from '@/libs/db';
import { ProductInterface, ReturnT, productSchema } from './schema';
import { TValidateDataHook, safeParseHook } from '@/hooks/validateDataHook';

export const createListing = async (inputData: ProductInterface): Promise<ReturnT> => {
  console.log('executed')
  const validatedData = safeParseHook(productSchema, inputData);
  if (!validatedData.validatedData) return validatedData;

  try {
    const userImages = await db.image.findMany({
      where: {
        userId: validatedData.validatedData.userId,
      },
    });
    const existingImageNames = userImages.map(image => image.name);
    const newImages = validatedData.validatedData.images.filter(image => !existingImageNames.includes(image.name));
    const newFiles = validatedData.validatedData.files.filter(file => !existingImageNames.includes(file.name));
    const result = await db.listing.create({
      data: {
        ...validatedData.validatedData,
        images: {
          create: newImages,
        },
        files: {
          create: newFiles,
        },
      },
    });
    revalidatePath(`/products/${inputData.userId}`);
    return {
      data: result,
    };
  } catch (e) {
    console.log(e);
    return {
      error: 'Error creating product listing. Please try again.',
    };
  }
};
