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
    const files = await db.fileInterface.findMany({
      where: {
        userId: userId,
      },
    });
    return Response.json(files ?? []);
  } catch (e) {
    console.log(e);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
