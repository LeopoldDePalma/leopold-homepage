import type {ReactNode} from 'react';
import {tv} from 'tailwind-variants';

const section = tv({
  slots: {
    root: 'flex flex-col gap-3',
    title: [
      'font-heading text-2xl font-bold',
      'underline decoration-accent/50 decoration-[0.12em] underline-offset-[0.3em]',
    ],
  },
});

const {root, title: titleStyles} = section();

type SectionProps = {
  title: string;
  children: ReactNode;
};

export const Section = ({title, children}: SectionProps) => {
  return (
    <section className={root()}>
      <h2 className={titleStyles()}>{title}</h2>
      {children}
    </section>
  );
};
