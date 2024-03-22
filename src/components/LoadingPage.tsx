import React from 'react';
import MaxWidthWrapper from './MaxWidthWrapper';
import { Loader2 } from 'lucide-react';

const LoadingPage = () => {
  return (
    <MaxWidthWrapper className='w-full h-full flex items-center justify-center'>
      <Loader2 color='var(--primary)' className='animate-spin' size={60} />
    </MaxWidthWrapper>
  );
};

export default LoadingPage;
