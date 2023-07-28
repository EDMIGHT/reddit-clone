import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';

import { toast } from './use-toast';

export const useCustomToasts = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      title: 'login required',
      description: 'you need to be logged in to do that',
      variant: 'destructive',
      action: (
        <Link onClick={() => dismiss()} className={buttonVariants()} href='/sign-in'>
          login
        </Link>
      ),
    });
  };

  return {
    loginToast,
  };
};
