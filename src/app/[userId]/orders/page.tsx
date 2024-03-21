import React from 'react';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { db } from '@/libs/db';

const page = async () => {
  const user = auth();
  if (!user.userId) {
    redirect('/sign-in');
  }

  return <p>Orders</p>;
};

export default page;
