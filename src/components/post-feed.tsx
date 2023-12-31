'use client';

import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { FC, useEffect, useRef } from 'react';

import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/configs/config';
import { ExtendedPost } from '@/types/db';

import { Post } from './post';

type PostFeedProps = {
  initialPosts: ExtendedPost[];
  subredditName?: string;
};

export const PostFeed: FC<PostFeedProps> = ({ initialPosts, subredditName }) => {
  const lastPostRef = useRef<HTMLElement>(null);

  const { data: session } = useSession();

  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['infinite-query'],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
        (!!subredditName ? `&subredditName=${subredditName}` : '');

      const { data } = await axios.get(query);

      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: {
        pages: [initialPosts],
        pageParams: [1],
      },
    }
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <ul className='col-span-2 flex flex-col space-y-6'>
      {posts.map((post, i) => {
        const votesAmount = post.votes.reduce((acc, vote) => {
          if (vote.type === 'UP') return acc + 1;
          if (vote.type === 'DOWN') return acc - 1;
          return acc;
        }, 0);

        const currentVote = post.votes.find((vote) => vote.userId === session?.user.id);

        if (i === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post
                currentVote={currentVote}
                votesAmt={votesAmount}
                commentAmt={post.comments.length}
                subredditName={post.subreddit.name}
                post={post}
              />
            </li>
          );
        } else {
          return (
            <li key={post.id}>
              <Post
                currentVote={currentVote}
                votesAmt={votesAmount}
                commentAmt={post.comments.length}
                subredditName={post.subreddit.name}
                post={post}
              />
            </li>
          );
        }
      })}
    </ul>
  );
};
