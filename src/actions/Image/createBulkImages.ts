'use server';
import { ImageSchemaT } from './schema';
import { db } from '@/libs/db';
export const createBulkImages = async (images: ImageSchemaT[]) => {
  const imageIds = [];

  for (const image of images) {
    const result = await db.imageInterface.create({ data: image });
    if (!result) return imageIds;
    imageIds.push(result);
  }
  return imageIds;
};
