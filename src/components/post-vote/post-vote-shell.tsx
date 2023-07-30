import { ArrowBigDown, ArrowBigUp, Loader2 } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';

export const PostVoteShell = () => {
  return (
    <div className='flex w-20 flex-col items-center pr-6'>
      {/* upvote */}
      <div
        className={buttonVariants({
          variant: 'ghost',
        })}
      >
        <ArrowBigUp className='h-5 w-5 text-muted-foreground' />
      </div>

      {/* score */}
      <div className='py-2 text-center text-sm font-medium'>
        <Loader2 className='h-3 w-3 animate-spin' />
      </div>

      {/* downvote */}
      <div
        className={buttonVariants({
          variant: 'ghost',
        })}
      >
        <ArrowBigDown className='h-5 w-5 text-muted-foreground' />
      </div>
    </div>
  );
};
