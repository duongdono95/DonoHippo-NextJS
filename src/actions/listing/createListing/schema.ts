import { fileSchema } from '@/actions/File/schema';
import { ImageSchema } from '@/actions/Image/schema';
import { TValidateDataHook } from '@/hooks/validateDataHook';
import { FileInterface, ImageInterface, ListingInterface } from '@prisma/client';
import { z } from 'zod';

export const productSchema = z.object({
  userId: z.string(),
  name: z.string().min(3, { message: 'Product Name is too short' }).max(255),
  description: z.string().min(3, {
    message: 'Product Description is too short',
  }),
  tag: z.enum(['Digital Image', 'Digital Product']),
  price: z.number().min(0),
});

export type ProductInterface = z.infer<typeof productSchema>;
