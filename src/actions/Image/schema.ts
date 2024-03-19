import { z } from 'zod';

export const ImageSchema = z.object({
  userId: z.string(),
  name: z.string(),
  imageUrl: z.string(),
});
export type ImageSchemaT = z.infer<typeof ImageSchema>;
