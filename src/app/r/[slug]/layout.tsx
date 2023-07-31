import { format } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import SubscribeLeaveToggle from '@/components/subscribe-leave-toggle';
import ToFeedButton from '@/components/to-feed-button';
import { buttonVariants } from '@/components/ui/button';
import { getAuthSession } from '@/configs/auth.config';
import { db } from '@/lib/db';

const Layout = async ({
  children,
  params: { slug },
}: {
  children: React.ReactNode;
  params: { slug: string };
}) => {
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
        },
      },
    },
  });

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          subreddit: {
            name: slug,
          },
          user: {
            id: session.user.id,
          },
        },
      });

  const isSubscribed = !!subscription;

  if (!subreddit) {
    return notFound();
  }

  const memberCount = await db.subscription.count({
    where: {
      subreddit: {
        name: slug,
      },
    },
  });

  return (
    <div className='mx-auto h-full max-w-7xl pt-12 sm:container'>
      <div>
        <ToFeedButton />
        <div className='grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4'>
          <div className='col-span-2 flex flex-col space-y-6'>{children}</div>
          <div className='order-first hidden h-fit overflow-hidden rounded-lg border border-border md:order-last md:block'>
            <div className='px-6 py-4'>
              <p className='py-3 font-semibold'>about r/{subreddit.name}</p>
            </div>

            <dl className='divide-y divide-muted bg-card px-6 py-4 text-sm leading-6'>
              <div className='flex justify-between gap-x-4 py-3'>
                <dt className='text-muted-foreground/80'>created</dt>
                <dd className='text-muted-foreground'>
                  <time dateTime={subreddit.createAt.toDateString()}>
                    {format(subreddit.createAt, 'MMMM d, yyyy')}
                  </time>
                </dd>
              </div>

              <div className='flex justify-between gap-x-4 py-3'>
                <dt className='text-muted-foreground/80'>members</dt>
                <dd className='text-muted-foreground'>
                  <div className='text-muted-foreground'>{memberCount}</div>
                </dd>
              </div>

              {subreddit.creatorId === session?.user.id ? (
                <div className='flex justify-between gap-x-4 py-3'>
                  <p className='text-muted-foreground'>you created this community</p>
                </div>
              ) : null}

              {subreddit.creatorId !== session?.user.id ? (
                <SubscribeLeaveToggle
                  isSubscribed={isSubscribed}
                  subredditId={subreddit.id}
                  subredditName={subreddit.name}
                />
              ) : null}

              <Link
                href={`r/${slug}/submit`}
                className={buttonVariants({
                  variant: 'outline',
                  className: 'w-full mb-6',
                })}
              >
                create post
              </Link>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
