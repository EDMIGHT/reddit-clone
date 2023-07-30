import { redirect } from 'next/navigation';

import { UserNameForm } from '@/components/user-name-form';
import { authOptions, getAuthSession } from '@/configs/auth.config';

export const metadata = {
  title: 'settings',
  description: 'Manage account and website settings',
};

const Page = async () => {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect(authOptions.pages?.signIn || '/sign-in');
  }

  return (
    <div className='mx-auto max-w-4xl py-12'>
      <div className='grid items-start gap-8'>
        <h1 className='text-3xl font-bold md:text-4xl'>settings</h1>
      </div>

      <div className='grid gap-10 py-6'>
        <UserNameForm
          user={{
            id: session.user.id,
            username: session.user.username || '',
          }}
        />
      </div>
    </div>
  );
};

export default Page;
