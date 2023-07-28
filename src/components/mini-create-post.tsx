'use client';

import { ImageIcon, Link2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import { FC } from 'react';

import { Button } from './ui/button';
import { Input } from './ui/input';
import UserAvatar from './user-avatar';

interface MiniCreatePostProps {
  session: Session | null;
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <li className='overflow-hidden rounded-md bg-card shadow'>
      <div className='flex h-full justify-between gap-6 px-6 py-4'>
        <div className='relative'>
          <UserAvatar
            user={{
              name: session?.user.name || null,
              image: session?.user.image || null,
            }}
          />

          <span className='absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 outline outline-2 outline-white' />
        </div>

        <Input
          readOnly
          onClick={() => router.push(pathname + '/submit')}
          placeholder='create post'
        />
        <Button variant='ghost' onClick={() => router.push(pathname + '/submit')}>
          <ImageIcon className='text-muted-foreground' />
        </Button>
        <Button variant='ghost' onClick={() => router.push(pathname + '/submit')}>
          <Link2 className='text-muted-foreground' />
        </Button>
      </div>
    </li>
  );
};

export default MiniCreatePost;
