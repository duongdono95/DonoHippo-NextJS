import React, { useState } from "react";
import { Button, MenuItem, TextField } from "@mui/material";
import Image from "next/image";
import { ImageInterface } from "@/types/GeneralTypes";
import { Check, Trash } from "lucide-react";

interface Props {
  images: ImageInterface[];
  setImages: React.Dispatch<React.SetStateAction<ImageInterface[]>>;
}

const UploadImage = ({ images, setImages }: Props) => {
  const maxImagesUpload: number = 10;
  const maxSizeInMB: number = 16;
  const maxSizeInBytes: number = maxSizeInMB * 1024 * 1024;

  const handleOnAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray: File[] = Array.from(e.target.files).slice(
      0,
      maxImagesUpload
    );

    const newImages: ImageInterface[] = [];
    for (const file of filesArray) {
      if (file.size > maxSizeInBytes) {
        alert(`File ${file.name} is too large. Max size is ${maxSizeInMB}MB.`);
        continue;
      }
      console.log(file);
      const fileUrl: ImageInterface = {
        name: file.name,
        url: URL.createObjectURL(file),
        createdAt: new Date().toISOString(),
      };
      newImages.push(fileUrl);
      console.log(fileUrl);
    }

    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  return (
    <div>
      <div className={"flex justify-between items-center"}>
        <div>
          <p></p>
          {images.length > 0 && (
            <div className={"flex items-center gap-2"}>
              <Check size={20} className={"text-green-500"} />
              <p className={"font-medium"}>{images[images.length - 1].name}</p>
            </div>
          )}
        </div>
        <label>
          <Button variant="contained" component="span">
            Upload Images
            <input
              hidden
              type="file"
              multiple
              onChange={handleOnAddImage}
              accept="image/*,.png,.jpg,.jpeg"
              style={{ display: "none" }}
            />
          </Button>
        </label>
      </div>
      <TextField select fullWidth sx={{ margin: "12px 0" }}>
        {images.map((image, index) => (
          <MenuItem key={index}>
            <div
              className={
                "flex gap-4 hover:bg-slate-200 rounded-lg   p-2  w-full"
              }
            >
              <div className={"relative w-20 h-20  rounded-lg overflow-hidden"}>
                <Image src={image.url} alt={image.name} fill />
              </div>
              <div className={"flex-grow flex justify-between items-center"}>
                <p className={"flex-grow"}>{image.name}</p>
                <Trash size={20} />
              </div>
            </div>
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export default UploadImage;
