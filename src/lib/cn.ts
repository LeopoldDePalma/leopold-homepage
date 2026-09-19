import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

/** Joins class names and resolves conflicting Tailwind utilities (the last one wins). */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
