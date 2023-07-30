import { Post as IPost, User, Vote } from '@prisma/client';
import { Link, MessageSquare } from 'lucide-react';
import { FC, useRef } from 'react';

import { formatTimeToNow } from '@/lib/utils';

import { EditorOutput } from './editor-output';
import { PostVoteClient } from './post-vote/post-vote-client';

type PartialVote = Pick<Vote, 'type'>;

type PostProps = {
  subredditName: string;
  post: IPost & {
    author: User;
    votes: Vote[];
  };
  commentAmt: number;
  votesAmt: number;
  currentVote?: PartialVote;
};

export const Post: FC<PostProps> = ({
  subredditName,
  post,
  commentAmt,
  votesAmt,
  currentVote,
}) => {
  const pRef = useRef<HTMLDivElement>(null);

  return (
    <div className='rounded-md bg-card shadow'>
      <div className='flex justify-between px-6 py-4'>
        <PostVoteClient
          postId={post.id}
          initialVote={currentVote?.type}
          initialVotesAmt={votesAmt}
        />
        <div className='w-0 flex-1'>
          <div className='mt-1 max-h-40 text-xs text-card-foreground'>
            {subredditName ? (
              <>
                <a
                  className='text-sm text-card-foreground underline underline-offset-2'
                  href={`/r/${subredditName}`}
                >
                  r/{subredditName}
                </a>
                <span className='px-1'>•</span>
              </>
            ) : null}
            <span>posted by u/{post.author.name}</span> {formatTimeToNow(post.createAt)}
          </div>
          <a href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className='py-2 text-lg font-semibold leading-6 text-secondary-foreground'>
              {post.title}
            </h1>
          </a>
          <div className='relative max-h-40 w-full overflow-hidden text-sm' ref={pRef}>
            <EditorOutput content={post.content} />

            {pRef.current?.clientHeight === 160 ? (
              // мы ограничили блок в 160px высоту и если он будет равен этой высоте, то мы делаем градиент внизу поста
              <div className='absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-card to-transparent' />
            ) : null}
          </div>
        </div>
      </div>

      <div className='z-20 bg-secondary p-4 text-sm sm:px-6'>
        <a
          className='flex w-fit items-center gap-2'
          href={`/r/${subredditName}/post/${post.id}`}
        >
          <MessageSquare className='h-4 w-4' /> {commentAmt} comments
        </a>
      </div>
    </div>
  );
};
