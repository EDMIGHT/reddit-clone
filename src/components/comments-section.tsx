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
              else if (vote.type === 'DOWN') return acc - 1;
              return acc;
            }, 0);

            const topLevelComVote = topLevelCom.votes.find(
              (vote) => vote.userId === session?.user.id
            );

            return (
              <div key={topLevelCom.id} className='flex flex-col'>
                <div className='mb-2'>
                  <PostComment
                    postId={postId}
                    currentVote={topLevelComVote}
                    votesAmt={topLevelComVotesAmt}
                    comment={topLevelCom}
                  />
                </div>
                {topLevelCom.replies
                  .sort((a, b) => b.votes.length - a.votes.length)
                  .map((reply) => {
                    const replyVotesAmt = reply.votes.reduce((acc, vote) => {
                      if (vote.type === 'UP') return acc + 1;
                      else if (vote.type === 'DOWN') return acc - 1;
                      return acc;
                    }, 0);

                    const replyVote = reply.votes.find(
                      (vote) => vote.userId === session?.user.id
                    );
                    return (
                      <div key={reply.id} className='ml-2 border-l-2 border-border py-2 pl-4'>
                        <PostComment
                          comment={reply}
                          currentVote={replyVote}
                          votesAmt={replyVotesAmt}
                          postId={postId}
                        />
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </div>
  );
};
