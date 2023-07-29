import { notFound } from 'next/navigation';

import { Editor } from '@/components/editor';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';

interface PageProps {
  params: {
    slug: string;
  };
}

const Page = async ({ params: { slug } }: PageProps) => {
  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
  });

  if (!subreddit) return notFound();

  return (
    <div className='flex flex-col items-start gap-6'>
      <div className='border-b border-border pb-5'>
        <div className='-ml-2 -mt-2 flex flex-wrap items-baseline'>
          <h3 className='ml-2 mt-2 text-base font-semibold leading-6 text-secondary-foreground'>
            create post
          </h3>
          <p className='ml-2 mt-1 truncate text-sm text-secondary-foreground/80'>
            in r/{subreddit.name}
          </p>
        </div>
      </div>

      <Editor subredditId={subreddit.id} />

      <div className='flex w-full justify-end'>
        <Button type='submit' className='w-full' form='subreddit-post-form'>
          post
        </Button>
      </div>
    </div>
  );
};

export default Page;
