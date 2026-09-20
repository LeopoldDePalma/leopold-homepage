import type {ComponentProps} from 'react';
import {tv} from 'tailwind-variants';

/** Shared with links that should read as buttons, such as the one on the 404 page. */
export const outlineButton = tv({
  base: [
    'inline-flex items-center gap-[0.5em]',
    'px-[1em] py-[0.5em]',
    'rounded-md border border-border',
    'transition active:scale-[0.97] motion-reduce:transition-none',
    'hover:border-accent hover:text-accent',
    'focus-ring',
  ],
});

/** A quiet button for secondary actions, such as retrying a failed render. */
export const OutlineButton = ({className, ...props}: Omit<ComponentProps<'button'>, 'type'>) => {
  return <button type="button" className={outlineButton({className})} {...props} />;
};
