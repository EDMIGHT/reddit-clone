import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { getAuthSession } from '@/configs/auth.config';

import { Icons } from './icons';
import { SearchBar } from './search-bar';
import UserMenu from './user-menu';

const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <div className='fixed inset-x-0 top-0 z-10 h-fit border-b border-border bg-background py-2'>
      <div className='container mx-auto flex h-full max-w-7xl items-center justify-between gap-2'>
        <Link href='/' className='flex items-center gap-2'>
          <Icons.logo className='h-8 w-8 sm:h-6 sm:w-6' />
          <span className='hidden text-sm font-medium text-secondary-foreground md:block'>
            ideas
          </span>
        </Link>

        <SearchBar />

        {session?.user ? (
          <UserMenu user={session.user} />
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
