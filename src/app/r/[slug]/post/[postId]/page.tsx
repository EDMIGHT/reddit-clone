import { Post, User, Vote } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { CommentsSection } from '@/components/comments-section';
import { EditorOutput } from '@/components/editor-output';
import { PostVoteServer } from '@/components/post-vote/post-vote-server';
import { PostVoteShell } from '@/components/post-vote/post-vote-shell';
import { db } from '@/lib/db';
import { redis } from '@/lib/redis';
import { formatTimeToNow } from '@/lib/utils';
import { CachedPost } from '@/types/redis';

type PageProps = {
  params: {
    postId: string;
  };
};

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const Page = async ({ params: { postId } }: PageProps) => {
  // мы получаем закэшированный пост и пока у нас не подгрузился пост с БД мы отображаем информацию кэшированого
  const cachedPost = (await redis.hgetall(`post:${postId}`)) as CachedPost;

  let post: (Post & { votes: Vote[]; author: User }) | null = null;

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: postId,
      },
      include: {
        votes: true,
        author: true,
      },
    });
  }

  if (!post && !cachedPost) return notFound();

  return (
    <div>
      <div className='flex h-full flex-col items-center justify-between sm:flex-row sm:items-start'>
        <Suspense fallback={<PostVoteShell />}>
          {/* @ts-expect-error server component */}
          <PostVoteServer
            postId={post?.id ?? cachedPost.id}
            getData={async () => {
              return await db.post.findUnique({
                where: {
                  id: postId,
                },
                include: {
                  votes: true,
                },
              });
            }}
          />
        </Suspense>

        <div className='w-full flex-1 rounded-sm bg-card p-4 sm:w-0'>
          <p className='mt-1 max-h-40 truncate text-xs text-secondary-foreground'>
            Posted by u/{post?.author.username ?? cachedPost.authorUsername}{' '}
            {formatTimeToNow(new Date(post?.createAt ?? cachedPost.createdAt))}
          </p>
          <h1 className='py-2 text-xl font-semibold leading-6'>
            {post?.title ?? cachedPost.title}
          </h1>

          <EditorOutput content={post?.content ?? cachedPost.content} />

          <Suspense fallback={<Loader2 className='h-5 w-5 animate-spin' />}>
            {/* @ts-expect-error server component */}
            <CommentsSection postId={post?.id ?? cachedPost.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Page;
