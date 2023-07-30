'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { UsernameRequest, UsernameValidator } from '@/lib/validators/user.validator';

type UserNameFormProps = {
  user: Pick<User, 'id' | 'username'>;
};

export const UserNameForm = ({ user }: UserNameFormProps) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsernameRequest>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      name: user?.username || '',
    },
  });

  const { mutate: changeUsername, isLoading } = useMutation({
    mutationFn: async ({ name }: UsernameRequest) => {
      const payload: UsernameRequest = {
        name,
      };

      const { data } = await axios.patch(`/api/username`, payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: 'username already taken',
            description: 'please choose a different username',
            variant: 'destructive',
          });
        }
      }

      return toast({
        title: 'oops, something went wrong!',
        description: 'could not change username',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        description: 'your username has been updated',
      });
      router.refresh();
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        changeUsername(data);
      })}
    >
      <Card>
        <CardHeader>
          <CardTitle>your username</CardTitle>
          <CardDescription>please enter a display name</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='relative grid gap-1'>
            <div className='absolute left-0 top-0 grid h-10 w-8 place-content-center'>
              <span className='text-sm text-muted-foreground'>u/</span>
            </div>

            <Label className='sr-only' htmlFor='name'>
              name
            </Label>
            <Input id='name' className='w-[400px] pl-6' size={32} {...register('name')} />

            {errors?.name && (
              <p className='px-1 text-xs text-destructive'>{errors.name.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button isLoading={isLoading}>change name</Button>
        </CardFooter>
      </Card>
    </form>
  );
};
