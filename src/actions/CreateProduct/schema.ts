import { z } from "zod";
const productSchema = z.object({
  userId: z.string(),
  name: z.string().min(3,{message: "Product Name is too short"}).max(255),
  description: z.string().min(3,{message: "Product Description is too short"}),
  tag: z.enum(["Digital Image", "Digital Product"]),
  price: z.number().min(0).default(0),
  imageUrl: z.string().nullable(),
  imageFile: z.array(z.string()),
});

// userId: userId,
//     name: "",
//     description: "",
//     tag: "Digital Image",
//     price: 0,
//     imageUrl: null,
//     imageFile: [],