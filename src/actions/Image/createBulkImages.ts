'use server';
import { auth } from "@clerk/nextjs";
import { ImageSchemaT } from './schema';
import { db } from '@/libs/db';
import { revalidatePath } from "next/cache";
export const createBulkImages = async (images: ImageSchemaT[]) => {
  const user = auth()
  const imageIds = [];

  for (const image of images) {
    const result = await db.imageInterface.create({ data: image });
    if (!result) return imageIds;
    imageIds.push(result);
  }
  revalidatePath(`/${user.userId}/media`);
  return imageIds;
};
