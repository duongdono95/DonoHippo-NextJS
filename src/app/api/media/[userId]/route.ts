import { db } from '@/libs/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

interface Props {
  params: {
    userId: string;
  };
}

export async function GET(req: Request, { params }: Props): Promise<Response> {
  const { userId } = auth();
  if (!userId) return new NextResponse('Unauthrorized', { status: 401 });
  try {
    const images = await db.imageInterface.findMany({
      where: {
        userId: userId,
      },
    });
    return Response.json(images);
  } catch (e) {
    console.log(e);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
