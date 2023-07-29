import { z } from 'zod';

import { getAuthSession } from '@/configs/auth.config';
import { db } from '@/lib/db';
import { PostValidator } from '@/lib/validators/post.validator';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('unauthorized', {
        status: 401,
      });
    }

    const body = await req.json();

    const { subredditId, title, content } = PostValidator.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return new Response('subscribe to post', {
        status: 400,
      });
    }

    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        subredditId,
      },
    });

    return new Response('ok');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('invalid request data passed', {
        status: 422,
      });
    }

    return new Response('could not post to subreddit at this thime', {
      status: 500,
    });
  }
}
