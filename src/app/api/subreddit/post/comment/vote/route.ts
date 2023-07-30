import { z } from 'zod';

import { getAuthSession } from '@/configs/auth.config';
import { db } from '@/lib/db';
import { CommentVoteValidator } from '@/lib/validators/vote.validator';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { commentId, voteType } = CommentVoteValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('unauth', {
        status: 401,
      });
    }

    const existingVote = await db.commentVote.findFirst({
      where: {
        userId: session.user.id,
        commentId,
      },
    });

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.commentVote.delete({
          where: {
            userId_commentId: {
              userId: session.user.id,
              commentId,
            },
          },
        });
        return new Response('ok');
      } else {
        await db.commentVote.update({
          where: {
            userId_commentId: {
              userId: session.user.id,
              commentId,
            },
          },
          data: {
            type: voteType,
          },
        });

        return new Response('ok');
      }
    }

    await db.commentVote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        commentId,
      },
    });

    return new Response('ok');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('invalid request data passed', {
        status: 422,
      });
    }

    return new Response('could not register your vote', {
      status: 500,
    });
  }
}
