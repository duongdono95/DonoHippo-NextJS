import { fileSchema } from '@/actions/File/schema';
import { ImageSchema } from '@/actions/Image/schema';
import { TValidateDataHook } from '@/hooks/validateDataHook';
import { Listing } from '@prisma/client';
import { z } from 'zod';

export const productSchema = z.object({
  userId: z.string(),
  name: z.string().min(3, { message: 'Product Name is too short' }).max(255),
  description: z.string().min(3, {
    message: 'Product Description is too short',
  }),
  tag: z.enum(['Digital Image', 'Digital Product']),
  price: z.number().min(0),
  images: z.array(ImageSchema).refine(images => images.length > 0, {
    message: 'At least one Thumbnail Photo is required',
  }),
  files: z.array(fileSchema).refine(images => images.length > 0, {
    message: 'At least one File is required',
  }),
});

export type ProductInterface = z.infer<typeof productSchema>;

export type ReturnT = TValidateDataHook<ProductInterface, Listing> & {
  error?: string;
  data?: Listing;
};
