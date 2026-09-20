import {IconBrandGithub, IconBrandInstagram, IconBrandTelegram} from '@tabler/icons-react';
import {map} from 'lodash-es';
import {tv} from 'tailwind-variants';

import {site} from '@/content/site';

const socialLinks = tv({
  slots: {
    list: 'flex flex-col gap-2',
    link: [
      'inline-flex items-center',
      'gap-[0.5em]',
      'text-accent',
      'underline-offset-4 transition-colors hover:underline',
    ],
    icon: 'size-[1.1em]',
  },
});

const {list, link, icon} = socialLinks();

const PROFILES = [
  {name: 'GitHub', Icon: IconBrandGithub, ...site.profiles.github},
  {name: 'Telegram', Icon: IconBrandTelegram, ...site.profiles.telegram},
  {name: 'Instagram', Icon: IconBrandInstagram, ...site.profiles.instagram},
];

export const SocialLinks = () => {
  return (
    <ul className={list()}>
      {map(PROFILES, ({name, url, handle, Icon}) => (
        <li key={name}>
          <a href={url} target="_blank" rel="noopener noreferrer" className={link()}>
            <Icon aria-hidden className={icon()} />
            {/* Latin either way: kept together and left to right, whatever the page direction. */}
            <bdi dir="ltr" lang="en">
              {name} {handle}
            </bdi>
          </a>
        </li>
      ))}
    </ul>
  );
};
