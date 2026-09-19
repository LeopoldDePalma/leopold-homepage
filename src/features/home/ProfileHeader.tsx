import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {tv} from 'tailwind-variants';

const profileHeader = tv({
  slots: {
    root: ['flex items-center', 'gap-6'],
    text: 'flex-1',
    name: 'text-4xl font-bold',
    role: ['mt-1', 'text-muted'],
    photo: ['size-28 shrink-0', 'rounded-full border-2 border-accent'],
  },
});

const {root, text, name, role, photo} = profileHeader();

export const ProfileHeader = () => {
  const t = useTranslations('HomePage');

  return (
    <div className={root()}>
      <div className={text()}>
        <h1 className={name()}>{t('name')}</h1>
        <p className={role()}>{t('role')}</p>
      </div>
      <Image
        src="/images/avatar.jpg"
        alt={t('photoAlt')}
        width={640}
        height={640}
        sizes="7rem"
        loading="eager"
        className={photo()}
      />
    </div>
  );
};
