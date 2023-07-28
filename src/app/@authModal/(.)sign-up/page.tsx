import { FC } from 'react';

import CloseModal from '@/components/close-modal';
import SignUp from '@/components/sign-up';

const page: FC = () => {
  return (
    <div className='fixed inset-0 z-10 bg-muted/30'>
      <div className='container mx-auto flex h-full max-w-lg items-center'>
        <div className='relative h-fit w-full rounded-lg bg-card px-2 py-20'>
          <div className='absolute right-4 top-4'>
            <CloseModal />
          </div>

          <SignUp />
        </div>
      </div>
    </div>
  );
};

export default page;
