"use client";
import React, { useState } from "react";
import { MenuItem, TextField } from "@mui/material";

import UploadImage from "@/components/UploadImage";
import { ImageInterface } from "@/types/GeneralTypes";

interface Props {
  userId: string;
}

const ProductCreateNew = ({ userId }: Props) => {
  const tags = ["Digital Image", "Digital Product"];
  const [form, setForm] = React.useState<{
    userId: string;
    name: string;
    description: string;
    tag: string;
    price: number;
    imageUrl: string | null;
    imageFile: File[];
  }>({
    userId: userId,
    name: "",
    description: "",
    tag: "Digital Image",
    price: 0,
    imageUrl: null,
    imageFile: [],
  });
  const [errors, setError] = useState([]);
  const [images, setImages] = useState<ImageInterface[]>([]);
  return (
    <div>
      <form className={"px-8 max-w-md mx-auto"}>
        <h3 className={"text-center p-4"}>Create New Listing</h3>
        <TextField
          label={"Name"}
          fullWidth
          sx={{ margin: "12px 0" }}
          variant={"outlined"}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <TextField
          label={"Description"}
          fullWidth
          sx={{ margin: "12px 0" }}
          variant={"outlined"}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <TextField
          label={"Tag"}
          fullWidth
          select
          sx={{ margin: "12px 0" }}
          variant={"outlined"}
          value={form.tag}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        >
          {tags.map((tag) => (
            <MenuItem key={tag} value={tag}>
              {tag}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label={"Price"}
          type={"number"}
          fullWidth
          sx={{ margin: "12px 0" }}
          variant={"outlined"}
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        />
        <TextField
          label={"Image Url"}
          type={"number"}
          fullWidth
          sx={{ margin: "12px 0" }}
          variant={"outlined"}
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        />
        <UploadImage images={images} setImages={setImages} />
      </form>
    </div>
  );
};

export default ProductCreateNew;
