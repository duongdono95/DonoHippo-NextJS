'use server';

import { db } from '@/libs/db';
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { toast } from 'react-toastify';

export const deleteListing = async (id: string) => {
  const user = auth()
  try {
    const deleteResult = await db.listingInterface.delete({
      where: {
        id: id,
      },
    });

    if (!deleteResult) {
      toast.error('Error deleting Listing');
    }
    revalidatePath(`/${user.userId}/listings`);
    return deleteResult;
  } catch (error) {
    console.log(error);
  }
};
