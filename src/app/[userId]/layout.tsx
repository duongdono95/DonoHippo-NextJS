'use client';
import WrapperFullWidth from '@/components/WrapperFullWidth';
import React from 'react';
import SideBar from './_components/SideBar';
interface Props {
  params: {
    userId: string;
  };
  children: React.ReactNode;
}

export default function layout({ params, children }: Props) {
  const { userId } = params;
  return (
    <WrapperFullWidth>
      <div className='flex  h-full'>
        <SideBar userId={userId} />
        <WrapperFullWidth>{children}</WrapperFullWidth>
      </div>
    </WrapperFullWidth>
  );
}
