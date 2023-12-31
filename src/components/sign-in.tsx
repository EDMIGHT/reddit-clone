import Link from 'next/link';
import { FC } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { Icons } from './icons';
import SignInForm from './sign-in-form';

const SignIn: FC = ({}) => {
  return (
    <div className='container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]'>
      <div className='flex flex-col space-y-2 text-center'>
        <Icons.logo className='mx-auto h-6 w-6' />
        <h1 className='text-2xl font-semibold tracking-tighter'>welcome back</h1>
        <p className='mx-auto max-w-xs text-sm'>
          by continuing, you are setting up an account and agree to our User Agreement and
          Privacy Policy.
        </p>

        <SignInForm />

        <p className='px-8 text-center text-sm text-secondary-foreground'>
          Don&apos;t have an account?{' '}
          <Link href='/sign-up' className={cn(buttonVariants({ variant: 'link' }), 'p-0')}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
