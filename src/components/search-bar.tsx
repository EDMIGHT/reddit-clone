'use client';

import { Prisma, Subreddit } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useCallback, useState } from 'react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

type SearchBarProps = {};

export const SearchBar: FC<SearchBarProps> = ({}) => {
  const [input, setInput] = useState('');

  const {
    data: queryRes,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      if (!input) return [];
      const { data } = await axios.get(`/api/search?q=${input}`);
      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType;
      })[];
    },
    queryKey: ['search-query'],
    enabled: false,
  });

  const request = debounce(() => {
    refetch();
  }, 300);

  const debounceRequest = useCallback(() => {
    request();
  }, []);

  const router = useRouter();

  return (
    <Command className='relative z-50 max-w-lg overflow-visible rounded-lg border'>
      <CommandInput
        value={input}
        onValueChange={(text) => {
          setInput(text);
          debounceRequest();
        }}
        className='border-none outline-none ring-0 focus:border-none focus:outline-none'
        placeholder='search communities..'
      />

      {input.length > 0 ? (
        <CommandList className='absolute inset-x-0 top-full rounded-b-md bg-card shadow'>
          {isFetched && <CommandEmpty>no results found</CommandEmpty>}
          {queryRes?.length ?? 0 ? (
            <CommandGroup heading='communities'>
              {queryRes?.map((subred) => (
                <CommandItem
                  key={subred.id}
                  onSelect={(e) => {
                    router.push(`/r/${e}`);
                    router.refresh();
                  }}
                  value={subred.name}
                >
                  <Users className='mr-2 h-4 w-4' />
                  <a href={`/r/${subred.name}`}>r/{subred.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      ) : null}
    </Command>
  );
};
