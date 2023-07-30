'use client';

import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCustomToasts } from '@/hooks/use-custom-toast';
import { toast } from '@/hooks/use-toast';
import { CommentRequest } from '@/lib/validators/comment.validator';

type CreateCommentProps = {
  postId: string;
  replyToId?: string;
};

export const CreateComment: FC<CreateCommentProps> = ({ postId, replyToId }) => {
  const router = useRouter();
  const { loginToast } = useCustomToasts();
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
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: 'oops, some problems',
        description: 'something went wrong',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      router.refresh();
      setInput('');
    },
  });

  return (
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

        <div className='mt-2 flex justify-end'>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() =>
              createComment({
                postId,
                text: input,
                replyToId,
              })
            }
          >
            post
          </Button>
        </div>
      </div>
    </div>
  );
};
