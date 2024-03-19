import { ProductFileInterface } from '@/app/products/[userId]/_components/ProductCreateNew';
import { FileInterface } from '@prisma/client';
import { ProductInterface } from '../listing/createListing/schema';

export const uploadFilesToCloud = async (
  files: ProductFileInterface[],
  userId: string,
): Promise<Pick<FileInterface, 'name' | 'fileUrl' | 'userId'>[] | undefined> => {
  const FileArr = [];
  console.log(files);
  for (const file of files) {
    if (file.file) {
      const formData = new FormData();
      formData.append('file', file.file);
      formData.append('upload_preset', `${process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME}`);
      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`, // Changed `file` to `image`
          {
            method: 'POST',
            body: formData,
          },
        );

        if (!response.ok) throw new Error('Failed to upload product File.');
        const data = await response.json();
        const fileUrl = {
          userId: userId,
          name: file.name,
          fileUrl: data.secure_url, // Cloudinary returns the URL of the uploaded file in `secure_url`
        };
        FileArr.push(fileUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    if (file.fileUrl) {
      const fileUrl = {
        userId: userId,
        name: file.name,
        fileUrl: file.fileUrl,
      };
      FileArr.push(fileUrl);
    }
  }
  return FileArr as Pick<FileInterface, 'name' | 'fileUrl' | 'userId'>[];
};
