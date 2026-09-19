import type {ComponentProps} from 'react';
import {tv} from 'tailwind-variants';

const iconButton = tv({
  base: [
    'inline-flex items-center justify-center',
    'p-[0.5em]',
    'rounded-md border border-border',
    'text-accent',
    'transition-colors hover:bg-foreground/5',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
  ],
});

type IconButtonProps = Omit<ComponentProps<'button'>, 'type' | 'aria-label'> & {
  /** Accessible name — the button shows only an icon. */
  label: string;
};

export const IconButton = ({label, className, ...props}: IconButtonProps) => {
  return <button type="button" aria-label={label} className={iconButton({className})} {...props} />;
};
