'use client';

import { auth } from '@clerk/nextjs';
import { toast } from 'react-toastify';
import { db } from '@/libs/db';
import { imageCloudinary } from './imageCloudinary';

export const createNewImage = async (file: File) => {
  const user = auth();
  if (!user || !user.userId) return toast.error('User not found');
  try {
    const uploadeToCloudResult = await imageCloudinary(file);
    if (!uploadeToCloudResult) return;
    const uploadImageToDB = db.imageInterface.create({
      data: {
        name: file.name,
        imageUrl: uploadeToCloudResult.imageUrl,
        userId: user.userId,
      },
    });
    return uploadImageToDB;
  } catch (error) {
    console.log(error);
  }
};
