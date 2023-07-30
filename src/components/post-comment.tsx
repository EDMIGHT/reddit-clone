'use client';

import { Comment, CommentVote, User } from '@prisma/client';
import { FC, useRef } from 'react';

import { formatTimeToNow } from '@/lib/utils';

import UserAvatar from './user-avatar';

type ExtendedComment = Comment & {
  author: User;
  votes: CommentVote[];
};

type PostCommentProps = {
  comment: ExtendedComment;
};

export const PostComment: FC<PostCommentProps> = ({ comment }) => {
  const commentRef = useRef<HTMLDivElement>(null);

  return (
    <div className='flex flex-col' ref={commentRef}>
      <div className='flex items-center'>
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className='h-6 w-6'
        />

        <div className='ml-2 flex items-center gap-x-2'>
          <p className='text-sm font-medium'>u/{comment.author.username}</p>
          <p className='max-h-40 truncate text-xs text-secondary-foreground'>
            {formatTimeToNow(new Date(comment.createAt))}
          </p>
        </div>
      </div>

      <p className='mt-2 text-sm'>{comment.text}</p>
    </div>
  );
};
