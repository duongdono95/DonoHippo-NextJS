import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { fetcher } from '@/hooks/fetcher';
import { ProductFileInterface } from '@/app/products/[userId]/_components/ProductCreateNew';
import { CircleCheck, FileCog } from 'lucide-react';

interface Props {
  userId: string;
  productFiles: ProductFileInterface[];
  setProductFiles: React.Dispatch<React.SetStateAction<ProductFileInterface[]>>;
}

const FileModal = ({ userId, productFiles, setProductFiles }: Props) => {
  const { data } = useQuery<File[]>({
    queryKey: ['media', 'userId', 'images'],
    queryFn: () => fetcher(`/api/files/${userId}`),
  });

  const selectedImgNames = productFiles.map(img => img.name);
  if (!data)
    return (
      <div>
        <h3 className='p-4 bg-slate-100 opacity-70 text-center' style={{ borderBottom: '1px solid var(--primary)' }}>
          Files
        </h3>
        <p className='p-4'>No Files was found!</p>
      </div>
    );
  return (
    <div>
      <h3 className='p-4 bg-slate-100 opacity-70 text-center' style={{ borderBottom: '1px solid var(--primary)' }}>
        Files ({data.length ?? 0})
      </h3>
      <div className='p-4 flex gap-2 flex-wrap'>
        {data &&
          data.map((file: any) => {
            const isSelected = selectedImgNames.includes(file.name);
            return (
              <div
                className='p-1 cursor-pointer hover:bg-slate-100 rounded-md'
                onClick={() => {
                  if (isSelected) {
                    setProductFiles(prev => prev.filter(img => img.name !== file.name));
                  } else {
                    setProductFiles(prev => [...prev, { userId, name: file.name, file: null, fileUrl: file.imageUrl }]);
                  }
                }}
              >
                <div key={file.id} className='relative'>
                  {isSelected && (
                    <div
                      className='absolute rounded-lg w-full flex items-center justify-center h-full top-0 left-0 z-10'
                      style={{
                        backgroundColor: 'var(--white01)',
                        backdropFilter: 'blur(2px)',
                        border: '2px solid var(--primary02)',
                      }}
                    >
                      <CircleCheck size={30} color='var(--primary05)' fill='var(--white05)' />
                    </div>
                  )}
                  <div className='w-28 h-28 rounded-md bg-slate-200'>
                    <FileCog className='m-2' />
                  </div>
                </div>
                <p className='truncate w-28 pt-2 pl-1'>{file.name}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default FileModal;
