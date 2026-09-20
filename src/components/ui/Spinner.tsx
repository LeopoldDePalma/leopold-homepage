import {LoaderCircle} from 'lucide-react';
import {tv} from 'tailwind-variants';

const spinner = tv({
  base: ['size-12', 'text-accent', 'animate-spin motion-reduce:animate-none'],
});

export const Spinner = ({className}: {className?: string}) => {
  return <LoaderCircle aria-hidden className={spinner({className})} />;
};
