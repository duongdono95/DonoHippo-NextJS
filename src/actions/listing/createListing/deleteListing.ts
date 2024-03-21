'use server';

import { db } from '@/libs/db';
import { toast } from 'react-toastify';

export const deleteListing = async (id: string) => {
  try {
    console.log(id);
    const deleteResult = await db.listingInterface.delete({
      where: {
        id: id,
      },
    });
    console.log(deleteResult);
    if (!deleteResult) {
      toast.error('Error deleting Listing');
    }
    return deleteResult;
  } catch (error) {
    console.log(error);
  }
};
