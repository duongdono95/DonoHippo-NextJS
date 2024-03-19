import { db } from '@/libs/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

interface Props {
  params: {
    userId: string;
  };
}

export async function GET(req: Request, { params }: Props) {
  const { userId } = auth();
  if (!userId) return new NextResponse('Unauthrorized', { status: 401 });
  try {
    const listings = await db.listingInterface.findMany({
      where: {
        userId: userId,
      },
    });
    console.log(userId)
    return Response.json(listings ?? []);
  } catch (e) {
    console.log(e);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
