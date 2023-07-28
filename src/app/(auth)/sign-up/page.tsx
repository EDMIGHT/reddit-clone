import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

import SignUp from '@/components/sign-up';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const page: FC = () => {
  return (
    <div className='absolute inset-0'>
      <div className='mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-20'>
        <Link
          href='/'
          className={cn(buttonVariants({ variant: 'link' }), 'self-start -mt-20')}
        >
          <ChevronLeft className='mr-2 h-4 w-4' /> home
        </Link>

        <SignUp />
      </div>
    </div>
  );
};

export default page;
