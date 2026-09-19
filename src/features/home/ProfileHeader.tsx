import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {tv} from 'tailwind-variants';

const profileHeader = tv({
  slots: {
    root: ['flex items-center', 'gap-6'],
    details: 'flex-1',
    name: 'text-4xl font-bold',
    role: ['mt-1', 'text-muted'],
    photo: ['size-28 shrink-0', 'rounded-full border-2 border-accent'],
  },
});

const {root, details, name, role, photo} = profileHeader();

export const ProfileHeader = () => {
  const tSite = useTranslations('Site');
  const t = useTranslations('ProfileHeader');

  return (
    <div className={root()}>
      <div className={details()}>
        <h1 className={name()}>{tSite('name')}</h1>
        <p className={role()}>{t('role')}</p>
      </div>
      <Image
        src="/images/avatar.jpg"
        alt={t('photoAlt', {name: tSite('name')})}
        width={640}
        height={640}
        sizes="7rem"
        loading="eager"
        className={photo()}
      />
    </div>
  );
};
