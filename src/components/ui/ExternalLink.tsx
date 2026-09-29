import {Link, type LinkProps} from '@chakra-ui/react';
import {mapValues} from 'lodash-es';
import type {ReactNode} from 'react';

type ExternalLinkProps = Omit<LinkProps, 'target' | 'rel'>;

export const externalLinkProps = {target: '_blank', rel: 'noopener noreferrer'} as const;

export const ExternalLink = (props: ExternalLinkProps) => (
  <Link {...externalLinkProps} {...props} />
);

/** Turns `{tag: href}` into `t.rich` renderers, so each tag in a message becomes a link. */
export const externalLinkTags = <Tag extends string>(
  hrefs: Record<Tag, string>,
  props?: ExternalLinkProps,
) =>
  mapValues(hrefs, (href) => {
    const Tag = (chunks: ReactNode) => (
      <ExternalLink href={href} {...props}>
        {chunks}
      </ExternalLink>
    );

    return Tag;
  });
