'use server';

import { db } from '@/libs/db';
import { ImageInterface } from '@prisma/client';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export default async function deleteImage(image: ImageInterface) {
  try {
    const deleteInCloudResult = await cloudinary.uploader.destroy(image.publicId);

    if (deleteInCloudResult.result !== 'ok') {
      return {
        result: 'failed',
      };
    }

    const deleteImageInDB = await db.imageInterface.delete({
      where: {
        id: image.id,
      },
    });

    return deleteImageInDB;
  } catch (error) {
    console.error(error);
  }
}
