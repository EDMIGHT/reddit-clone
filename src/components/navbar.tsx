import Link from 'next/link';
import { Icons } from './icons';
import { buttonVariants } from '@/components/ui/button';
import { getAuthSession } from '@/configs/auth.config';

const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <div className='fixed top-0 inset-x-0 h-fit bg-secondary border-b-2 z-10 py-2'>
      <div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
        <Link href='/' className='flex gap-2 items-center'>
          <Icons.logo className='h-8 w-8 sm:h-6 sm:w-6' />
          <span className='hidden text-secondary-foreground text-sm font-medium md:block'>
            ideas
          </span>
        </Link>

        {session ? (
          <div>a</div>
        ) : (
          <Link href='/sign-in' className={buttonVariants()}>
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
