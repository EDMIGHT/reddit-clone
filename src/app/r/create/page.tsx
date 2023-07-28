'use client';

import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCustomToasts } from '@/hooks/use-custom-toast';
import { toast } from '@/hooks/use-toast';
import { CreateSubredditPayload } from '@/lib/validators/subreddit.validator';

const Page: FC = ({}) => {
  const [input, setInput] = useState('');
  const router = useRouter();
  const { loginToast } = useCustomToasts();

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubredditPayload = {
        name: input,
      };

      const { data } = await axios.post('/api/subreddit', payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: 'subreddit already exists',
            description: 'please choose a different subreddit name',
            variant: 'destructive',
          });
        }
        if (err.response?.status === 422) {
          return toast({
            title: 'invalidate subreddit name',
            description: 'please choose a name between 3 and 21 characters',
            variant: 'destructive',
          });
        }
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      toast({
        title: 'oops, something went wrong!',
        description: 'could not create subreddit',
        variant: 'destructive',
      });
    },
    onSuccess: (data) => {
      router.push(`/r/${data}`);
    },
  });

  return (
    <div className='container mx-auto flex h-full max-w-3xl items-center '>
      <div className='relative h-fit w-full space-y-6 rounded-lg bg-card p-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-xl font-semibold'>create a community</h1>
        </div>
        <hr className='h-px bg-border' />

        <div>
          <p className='text-lg font-medium'>name</p>
          <p className='pb-2 text-xs'>community including capitalization cannot be changed</p>

          <div className='relative'>
            <p className='absolute inset-y-0 left-0 grid w-8 place-items-center text-sm text-muted-foreground'>
              r/
            </p>
            <Input value={input} onChange={(e) => setInput(e.target.value)} className='pl-6' />
          </div>
        </div>

        <div className='flex justify-end gap-4'>
          <Button variant='secondary' onClick={() => router.back()}>
            cancel
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => createCommunity()}
          >
            create community
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
