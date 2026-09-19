import {LoaderCircle} from 'lucide-react';
import {tv} from 'tailwind-variants';

const spinner = tv({
  base: ['size-8', 'text-accent', 'animate-spin motion-reduce:animate-none'],
});

export const Spinner = () => {
  return <LoaderCircle aria-hidden className={spinner()} />;
};
