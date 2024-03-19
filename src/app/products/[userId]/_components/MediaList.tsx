import { fetcher } from '@/hooks/fetcher';
import { ImageInterface } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

interface Props {
  userId: string;
}

const MediaList = ({ userId }: Props) => {
  const { data } = useQuery<ImageInterface>({
    queryKey: ['media', 'images', 'image'],
    queryFn: () => fetcher(`/api/media/${userId}`),
  });
  console.log(data);
  return <div>MediaList</div>;
};

export default MediaList;
