'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

import { Button } from '@/components/ui/button';

const CloseModal: FC = () => {
  const router = useRouter();

  const onClickClose = () => {
    router.back();
  };

  return (
    <Button
      variant='secondary'
      className='h-6 w-6 rounded p-0'
      aria-label='close modal'
      onClick={onClickClose}
    >
      <X className='h-4 w-4' />
    </Button>
  );
};

export default CloseModal;
