import { getAuthSession } from '@/configs/auth.config';
import { db } from '@/lib/db';

import { CreateComment } from './create-comment';
import { PostComment } from './post-comment';

type CommentsSectionProps = {
  postId: string;
};

export const CommentsSection = async ({ postId }: CommentsSectionProps) => {
  const session = await getAuthSession();

  const comments = await db.comment.findMany({
    where: {
      postId,
      replyToId: null, // так мы получаем только первый уровень комментариев к которым уже подключаем второй через include
    },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  return (
    <div className='mt-4 flex flex-col gap-y-4'>
      <hr className='my-6 h-px w-full' />

      <CreateComment postId={postId} />

      <div className='mt-4 flex flex-col gap-y-6'>
        {comments
          .filter((comment) => !comment.replyToId)
          .map((topLevelCom) => {
            const topLevelComVotesAmt = topLevelCom.votes.reduce((acc, vote) => {
              if (vote.type === 'UP') return acc + 1;
              else if (vote.type === 'DOWN') return acc + 1;
              return acc;
            }, 0);

            const topLevelComVote = topLevelCom.votes.find(
              (vote) => vote.userId === session?.user.id
            );

            return (
              <div key={topLevelCom.id} className='flex flex-col'>
                <div className='mb-2'>
                  <PostComment comment={topLevelCom} />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
