import { ZodError, z } from "zod";

export type TValidateDataHook<TInput, TOutput> = {
  zodError?: z.ZodIssue[];
  validatedData?: TInput;
};

export const safeParseHook = <TInput, TOutput>(
  schema: z.Schema<TInput>,
  data: TInput
): TValidateDataHook<TInput, TOutput> => {
  const validatedData = schema.safeParse(data);
  if (!validatedData.success) {
    return {
      zodError: validatedData.error.errors,
    };
  }
  return {
    validatedData: validatedData.data,
  };
};
