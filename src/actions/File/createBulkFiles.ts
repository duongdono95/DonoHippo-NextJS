'use server';
import { FileSchemaT } from './schema';
import { db } from '@/libs/db';
export const createBulkFiles = async (files: FileSchemaT[]) => {
  const fileIds = [];
  for (const file of files) {
    const result = await db.fileInterface.create({ data: file });
    if (!result) return fileIds;
    fileIds.push(result);
  }
  return fileIds;
};
