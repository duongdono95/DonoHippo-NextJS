import { ImageInputType } from '@/app/[userId]/create-new/_components/ProductCreateNew';

export const imagesCloudinary = async (imgs: ImageInputType[], userId: string) => {
  const resultArr = [];
  for (const img of imgs) {
    if (img.file) {
      const formData = new FormData();
      formData.append('file', img.file);
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
        resultArr.push({
          userId: userId,
          name: img.name,
          imageUrl: data.secure_url,
          publicId: data.public_id,
          signature: data.signature,
        });
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    if (img.fileUrl) {
      resultArr.push({
        userId: userId,
        name: img.name,
        imageUrl: img.fileUrl,
        publicId: img.publicId,
        signature: img.signature,
      });
    }
  }
  return resultArr;
};
