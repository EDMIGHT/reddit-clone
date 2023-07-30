import { HomeIcon } from 'lucide-react';
import Link from 'next/link';

import { CustomFeed } from '@/components/custom-feed';
import { GeneralFeed } from '@/components/general-feed';
import { buttonVariants } from '@/components/ui/button';
import { getAuthSession } from '@/configs/auth.config';

export default async function Home() {
  const session = await getAuthSession();

  return (
    <>
      <h1 className='text-3xl font-bold md:text-4xl'>your feed</h1>
      <div className='grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4'>
        {/* @ts-expect-error server component */}
        {session ? <CustomFeed /> : <GeneralFeed />}

        <div className='order-first h-fit overflow-hidden rounded-lg border border-border md:order-last'>
          <div className='bg-secondary px-6 py-4'>
            <p className='flex items-center gap-1.5 py-3 font-semibold'>
              <HomeIcon className='h-4 w-4' />
              home
            </p>
          </div>

          <div className='-my-3 divide-y divide-border px-6 py-4 text-sm leading-6'>
            <div className='flex justify-between gap-x-4 py-3'>
              <p className='text-foreground/80'>
                your personal homepage. come here to check in with your favorite communities
              </p>
            </div>
            <Link
              className={buttonVariants({
                className: 'w-full mt-4 mb-6',
              })}
              href='/r/create'
            >
              create community
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
