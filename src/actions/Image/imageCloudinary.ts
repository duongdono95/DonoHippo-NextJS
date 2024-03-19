export const imageCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
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
      name: file.name,
      imageUrl: data.secure_url, // Cloudinary returns the URL of the uploaded file in `secure_url`
    };
    return fileUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};
