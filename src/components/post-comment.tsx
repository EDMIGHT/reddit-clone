'use client';

import { Comment, CommentVote as ICommentVote, User } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FC, useRef, useState } from 'react';

import { toast } from '@/hooks/use-toast';
import { formatTimeToNow } from '@/lib/utils';
import { CommentRequest } from '@/lib/validators/comment.validator';

import { CommentVote } from './comment-vote';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import UserAvatar from './user-avatar';

type ExtendedComment = Comment & {
  author: User;
  votes: ICommentVote[];
};

type PostCommentProps = {
  comment: ExtendedComment;
  votesAmt: number;
  currentVote: ICommentVote | undefined;
  postId: string;
};

export const PostComment: FC<PostCommentProps> = ({
  comment,
  currentVote,
  votesAmt,
  postId,
}) => {
  const commentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const [isReplying, setIsReplying] = useState(false);
  const [input, setInput] = useState('');

  const { mutate: createComment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId,
      };

      const { data } = await axios.patch(`/api/subreddit/post/comment`, payload);
      return data;
    },
    onError: () => {
      return toast({
        title: 'something went wrong',
        description: 'comment wasnt posted successfully',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      router.refresh();
      setIsReplying(false);
    },
  });

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

      <div className='flex flex-wrap items-center gap-2'>
        <CommentVote
          commentId={comment.id}
          initialVotesAmt={votesAmt}
          initialVote={currentVote}
        />
        <Button
          onClick={() => {
            if (!session) return router.push('/sign-in');
            setIsReplying(true);
          }}
          variant='ghost'
          size='sm'
          aria-label='reply'
        >
          <MessageSquare className='mr-1.5 h-4 w-4' />
          reply
        </Button>

        {isReplying ? (
          <div className='grid w-full gap-1.5'>
            <Label htmlFor='comment'>your comment</Label>
            <div className='mt-2'>
              <Textarea
                id='comment'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={1}
                placeholder='what are you thoughts?'
              />

              <div className='mt-2 flex justify-end gap-2'>
                <Button tabIndex={-1} variant='outline' onClick={() => setIsReplying(false)}>
                  cancel
                </Button>
                <Button
                  isLoading={isLoading}
                  disabled={input.length === 0}
                  onClick={() => {
                    if (!input) return;
                    createComment({
                      postId,
                      text: input,
                      replyToId: comment.replyToId ?? comment.id,
                    });
                  }}
                >
                  post
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
