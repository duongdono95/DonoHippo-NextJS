'use server';
import { revalidatePath } from "next/cache";
import { FileSchemaT } from './schema';
import { db } from '@/libs/db';
import { auth } from '@clerk/nextjs'
export const createBulkFiles = async (files: FileSchemaT[]) => {
  const user = await auth();
  if(!user.userId) return [];
  const fileIds = [];
  for (const file of files) {
    const result = await db.fileInterface.create({ data: file });
    if (!result) return fileIds;
    fileIds.push(result);
    revalidatePath(`/${user.userId}/files`);
  }
  return fileIds;
};
