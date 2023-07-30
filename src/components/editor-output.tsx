import dynamic from 'next/dynamic';
import Image from 'next/image';
import { FC } from 'react';

const Output = dynamic(async () => (await import('editorjs-react-renderer')).default, {
  ssr: false,
});

type EditorOutputProps = { content: any };

const style = {
  paragraph: {
    fontSize: '0.875rem',
    lineHeight: '1.25',
  },
};

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
};

export const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  // @ts-expect-error
  return <Output data={content} style={style} className='text-sm' renderers={renderers} />;
};

function CustomCodeRenderer({ data }: any) {
  return (
    <pre className='rounded-md bg-secondary p-4'>
      <code className='text-sm text-secondary-foreground'>{data.code}</code>
    </pre>
  );
}

function CustomImageRenderer({ data }: any) {
  const src = data.file.url;

  return (
    <div className='relative min-h-[15rem] w-full'>
      <Image alt='image' className='object-contain' fill src={src} />
    </div>
  );
}
