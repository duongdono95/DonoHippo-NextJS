import { ImageInputType } from '@/app/products/[userId]/_components/ProductCreateNew';
import { ImageInterface } from '@prisma/client';

export const uploadImagesToCloud = async (
  imgFiles: ImageInputType[],
  userId: string,
): Promise<Pick<ImageInterface, 'name' | 'imageUrl' | 'userId'>[] | undefined> => {
  const imageArr = [];
  for (const file of imgFiles) {
    if (file.file) {
      const formData = new FormData();
      formData.append('file', file.file);
      formData.append('upload_preset', `${process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME}`);
      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          },
        );

        if (!response.ok) throw new Error('Failed to upload image.');

        const data = await response.json();

        const fileUrl = {
          userId: userId,
          name: file.name,
          imageUrl: data.secure_url, // Cloudinary returns the URL of the uploaded file in `secure_url`
        };

        imageArr.push(fileUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    if (file.fileUrl) {
      const fileUrl = {
        userId: userId,
        name: file.name,
        imageUrl: file.fileUrl, // Cloudinary returns the URL of the uploaded file in `secure_url`
      };
      imageArr.push(fileUrl);
    }
  }
  return imageArr as Pick<ImageInterface, 'name' | 'imageUrl' | 'userId'>[];
};
