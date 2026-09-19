import {SiGithub, SiTelegram} from '@icons-pack/react-simple-icons';
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

const profiles = [
  {name: 'GitHub', href: site.links.github, Icon: SiGithub},
  {name: 'Telegram', href: site.links.telegram, Icon: SiTelegram},
];

export const SocialLinks = () => {
  return (
    <ul className={list()}>
      {map(profiles, ({name, href, Icon}) => (
        <li key={name}>
          <a href={href} target="_blank" rel="noopener noreferrer" className={link()}>
            <Icon aria-hidden className={icon()} />
            <span>
              {name} <span dir="ltr">{site.handle}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
};
