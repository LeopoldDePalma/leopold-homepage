import {Link, type LinkProps} from '@chakra-ui/react';
import {mapValues} from 'lodash-es';
import type {ReactNode} from 'react';

type ExternalLinkProps = Omit<LinkProps, 'target' | 'rel'>;

export const ExternalLink = (props: ExternalLinkProps) => (
  <Link target="_blank" rel="noopener noreferrer" {...props} />
);

/** Turns `{tag: href}` into `t.rich` renderers, so each tag in a message becomes a link. */
export const externalLinkTags = (hrefs: Record<string, string>, props?: ExternalLinkProps) =>
  mapValues(hrefs, (href) => {
    const Tag = (chunks: ReactNode) => (
      <ExternalLink href={href} {...props}>
        {chunks}
      </ExternalLink>
    );

    return Tag;
  });
