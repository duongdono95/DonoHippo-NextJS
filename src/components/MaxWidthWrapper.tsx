import { cn } from '@/libs/utils';
import { ReactNode } from 'react';

const MaxWidthWrapper = ({ className, children }: { className?: string; children: ReactNode }) => {
  return <div className={cn('mx-auto w-full max-w-screen-xl md:px-20', className)}>{children}</div>;
};

export default MaxWidthWrapper;
