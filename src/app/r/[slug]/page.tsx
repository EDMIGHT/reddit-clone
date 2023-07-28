import { notFound } from 'next/navigation';
import { FC } from 'react';

import MiniCreatePost from '@/components/mini-create-post';
import { getAuthSession } from '@/configs/auth.config';
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/configs/config';
import { db } from '@/lib/db';

interface PageProps {
  params: {
    slug: string;
  };
}

const Page = async ({ params: { slug } }: PageProps) => {
  const session = await getAuthSession();

  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },

        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
      },
    },
  });

  if (!subreddit) {
    return notFound();
  }

  return (
    <>
      <h1 className='h-14 text-3xl font-bold md:text-4xl'>r/{subreddit.name}</h1>
      <MiniCreatePost session={session} />
    </>
  );
};

export default Page;
