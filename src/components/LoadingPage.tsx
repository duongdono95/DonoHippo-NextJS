import React from 'react';
import MaxWidthWrapper from './MaxWidthWrapper';
import { Loader2 } from 'lucide-react';

const LoadingPage = () => {
  return (
    <MaxWidthWrapper className='flex items-center justify-end'>
      <Loader2 color='var(--primary)' className='animate-spin' size={40} />
    </MaxWidthWrapper>
  );
};

export default LoadingPage;
