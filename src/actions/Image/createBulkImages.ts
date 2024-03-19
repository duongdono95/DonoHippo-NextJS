'use server';
import { ImageSchemaT } from './schema';
import { db } from '@/libs/db';
export const createBulkImages = async (images: ImageSchemaT[]) => {
  const imageIds: string[] = [];
  const allImgs = await db.imageInterface.findMany({
    where: {
      userId: images[0].userId,
    },
  });
  const allImgUrls = allImgs.map(image => image.imageUrl);
  const excludedImgs = images.filter(image => allImgUrls.includes(image.imageUrl));

  for (const image of excludedImgs) {
    const result = await db.imageInterface.create({ data: image });
    if (!result) return imageIds;
    imageIds.push(result.id);
  }
  return imageIds;
};
