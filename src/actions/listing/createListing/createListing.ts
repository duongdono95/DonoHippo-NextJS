'use server';
import { revalidatePath } from 'next/cache';
import { db } from '@/libs/db';
import { ProductInterface, productSchema } from './schema';
import { safeParseHook } from '@/hooks/validateDataHook';

export const createListing = async (inputData: ProductInterface & { imgIds: string[]; fileIds: string[] }) => {
  const validatedData = safeParseHook(productSchema, inputData);
  if (!validatedData.validatedData) return validatedData;

  try {
    const result = await db.listingInterface.create({
      data: inputData,
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
