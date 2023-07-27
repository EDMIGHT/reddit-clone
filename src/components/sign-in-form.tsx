'use client';

import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { signIn } from 'next-auth/react';
import { Icons } from './icons';
import { useToast } from '@/hooks/use-toast';

interface SignInForm extends React.HTMLAttributes<HTMLDivElement> {}

const SignInForm: FC<SignInForm> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loginWithGoogle = async () => {
    setIsLoading(true);

    try {
      await signIn('google');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Oops, something went wrong while logging in with google.',
        description: 'Please double check your input or try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div {...props} className={cn('flex justify-center', className)}>
      <Button
        onClick={loginWithGoogle}
        isLoading={isLoading}
        size='sm'
        className='w-full text-sm font-medium'
      >
        {isLoading ? null : <Icons.google className='h-4 w-4 mr-2' />}
        Google
      </Button>
    </div>
  );
};

export default SignInForm;
