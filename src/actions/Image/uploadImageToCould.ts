import { ProductInterface } from '@/actions/product/createListing/schema';
import { ImageFileInterface, ProductFileInterface } from '@/app/products/[userId]/_components/ProductCreateNew';
import { Image } from '@prisma/client';

export const uploadImagesToCloud = async (
  imgFiles: ImageFileInterface[],
  form: ProductInterface,
): Promise<Image[] | undefined> => {
  const imageArr = [];
  for (const file of imgFiles) {
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
        userId: form.userId,
        name: file.name,
        imageUrl: data.secure_url, // Cloudinary returns the URL of the uploaded file in `secure_url`
      };

      imageArr.push(fileUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }
  return imageArr as Image[];
};
