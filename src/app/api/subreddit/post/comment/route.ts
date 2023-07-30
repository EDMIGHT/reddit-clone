import { z } from 'zod';

import { getAuthSession } from '@/configs/auth.config';
import { db } from '@/lib/db';
import { CommentValidator } from '@/lib/validators/comment.validator';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { postId, text, replyToId } = CommentValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('unauth', {
        status: 401,
      });
    }

    await db.comment.create({
      data: {
        text,
        postId,
        authorId: session.user.id,
        replyToId,
      },
    });

    return new Response('ok');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('invalid request data passed', {
        status: 422,
      });
    }

    return new Response('could not create comment', {
      status: 500,
    });
  }
}
