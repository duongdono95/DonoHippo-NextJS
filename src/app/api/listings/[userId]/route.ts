import { db } from '@/libs/db';
import { auth } from '@clerk/nextjs';
import { ListingInterface } from '@prisma/client';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
interface Props {
  params: {
    userId: string;
  };
}

export async function GET(req: Request, { params }: Props) {
  if (!params.userId) return new NextResponse('Unauthrorized', { status: 401 });
  try {
    const listings = await db.listingInterface.findMany({
      where: {
        userId: params.userId,
      },
    });
    return Response.json(listings ?? []);
  } catch (e) {
    console.log(e);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
