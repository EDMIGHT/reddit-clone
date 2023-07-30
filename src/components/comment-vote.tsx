'use client';

import { usePrevious } from '@mantine/hooks';
import { CommentVote as ICommentVote, VoteType } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { FC, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useCustomToasts } from '@/hooks/use-custom-toast';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CommentVoteRequest } from '@/lib/validators/vote.validator';

type PartialVote = Pick<ICommentVote, 'type'>;

type CommentVoteProps = {
  commentId: string;
  initialVotesAmt: number;
  initialVote?: PartialVote;
};

export const CommentVote: FC<CommentVoteProps> = ({
  commentId,
  initialVotesAmt,
  initialVote,
}) => {
  const { loginToast } = useCustomToasts();
  const [votesAmt, setVotesAmt] = useState(initialVotesAmt);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote); // сохраняет прошлое значение, чтоб в случае не успеха запроса мы смогли вернуть его

  const { mutate: vote } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: CommentVoteRequest = {
        commentId,
        voteType: type,
      };

      await axios.patch('/api/subreddit/post/comment/vote', payload);
    },
    onError: (err, voteType) => {
      // возвращаем состояние до запроса (мы его измен)
      if (voteType === 'UP') setVotesAmt((prev) => prev - 1);
      else setVotesAmt((prev) => prev + 1);

      setCurrentVote(prevVote);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) loginToast();
      }

      return toast({
        title: 'something went wrong',
        description: 'your vote was not register',
        variant: 'destructive',
      });
    },
    onMutate: (type) => {
      // optimistic updates - то есть мы заранее показываем пользователю оптимистичный результат
      if (currentVote?.type === type) {
        // если клик на голос, который уже пользователь выбирал - мы его убираем
        setCurrentVote(undefined);
        if (type === 'UP') setVotesAmt((prev) => prev - 1);
        else if (type === 'DOWN') setVotesAmt((prev) => prev + 1);
      } else {
        // если голос отличается от текущего
        setCurrentVote({ type });
        // мы ставим undefined если пост не имеет голоса и потому +1, если же имеет, то нужно откатить прошлый голос и добавить новый, потому +2
        if (type === 'UP') setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
        else if (type === 'DOWN') setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
      }
    },
  });

  return (
    <div className='flex gap-1'>
      <Button onClick={() => vote('UP')} size='sm' variant='ghost' aria-label='upvote'>
        <ArrowBigUp
          className={cn('h-5 w-5 text-secondary-foreground', {
            'text-emerald-500 fill-emerald-500': currentVote?.type === 'UP',
          })}
        />
      </Button>

      <p className='py-2 text-center text-sm font-medium'>{votesAmt}</p>

      <Button onClick={() => vote('DOWN')} size='sm' variant='ghost' aria-label='dowmvote'>
        <ArrowBigDown
          className={cn('h-5 w-5 text-secondary-foreground', {
            'text-destructive fill-destructive': currentVote?.type === 'DOWN',
          })}
        />
      </Button>
    </div>
  );
};
