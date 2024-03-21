import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { fetcher } from '@/hooks/fetcher';
import { FileInputType } from '@/app/[userId]/create-new/_components/ProductCreateNew';
import { CircleCheck, FileCog } from 'lucide-react';
import { FileInterface } from '@prisma/client';

interface Props {
  userId: string;
  selectedFromFiles: FileInterface[];
  setSelectedFromFiles: React.Dispatch<React.SetStateAction<FileInterface[]>>;
}

const FileModal = ({ userId, selectedFromFiles, setSelectedFromFiles }: Props) => {
  const { data } = useQuery<FileInterface[]>({
    queryKey: ['files', 'userId', 'images'],
    queryFn: () => fetcher(`/api/files/${userId}`),
  });

  const selectedFileNames = selectedFromFiles.map(img => img.name);
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
          data.map(file => {
            const isSelected = selectedFileNames.includes(file.name);
            return (
              <div
                key={file.id}
                className='p-1 cursor-pointer hover:bg-slate-100 rounded-md'
                onClick={() => {
                  if (isSelected) {
                    setSelectedFromFiles(prev => prev.filter(img => img.name !== file.name));
                  } else {
                    setSelectedFromFiles(prev => [...prev, file]);
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
