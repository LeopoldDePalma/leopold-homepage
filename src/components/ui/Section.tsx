import type {ReactNode} from 'react';
import {tv} from 'tailwind-variants';

const section = tv({
  slots: {
    root: 'flex flex-col gap-3',
    heading: [
      'font-heading text-2xl font-bold',
      'underline decoration-accent/50 decoration-[0.12em] underline-offset-[0.3em]',
    ],
  },
});

const {root, heading} = section();

export const Section = ({title, children}: {title: string; children: ReactNode}) => {
  return (
    <section className={root()}>
      <h2 className={heading()}>{title}</h2>
      {children}
    </section>
  );
};
