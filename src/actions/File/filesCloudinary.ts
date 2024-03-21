import { FileInputType } from '@/app/products/[userId]/_components/ProductCreateNew';

export const filesCloudinary = async (files: FileInputType[], userId: string) => {
  const resultArr = [];
  for (const file of files) {
    if (file.file) {
      const formData = new FormData();
      formData.append('file', file.file);
      formData.append('upload_preset', `${process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME}`);
      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`,
          {
            method: 'POST',
            body: formData,
          },
        );
        if (!response.ok) throw new Error('Failed to upload product File.');
        const data = await response.json();
        resultArr.push({
          userId: userId,
          name: file.name,
          fileUrl: data.secure_url,
          publicId: data.public_id,
          signature: data.signature,
        });
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    if (file.fileUrl) {
      resultArr.push({
        userId: userId,
        name: file.name,
        fileUrl: file.fileUrl,
        publicId: file.publicId,
        signature: file.signature,
      });
    }
  }
  return resultArr;
};
