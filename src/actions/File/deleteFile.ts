'use server';

import { FileInterface } from '@prisma/client';
import { db } from '@/libs/db';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export const deleteFile = async (file: FileInterface) => {
  console.log(file);
  try {
    const deleteInCloudResult = await cloudinary.uploader.destroy(file.publicId, { resource_type: 'raw' });
    console.log(deleteInCloudResult);
    if (deleteInCloudResult.result !== 'ok') {
      return {
        result: 'failed',
      };
    }

    const deleteFileInDB = await db.fileInterface.delete({
      where: {
        id: file.id,
      },
    });

    return deleteFileInDB;
  } catch (error) {
    console.error(error);
  }
};
