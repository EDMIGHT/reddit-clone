import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/configs/config';
import { db } from '@/lib/db';

import { PostFeed } from './post-feed';

export const GeneralFeed = async () => {
  const posts = await db.post.findMany({
    orderBy: {
      createAt: 'desc',
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
  });

  return <PostFeed initialPosts={posts} />;
};
