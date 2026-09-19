import {useTranslations} from 'next-intl';

const HomePage = () => {
  const t = useTranslations('HomePage');

  return (
    <section>
      <h1 className="text-3xl font-bold">{t('name')}</h1>
      <p className="mt-2 text-muted">{t('role')}</p>
    </section>
  );
};

export default HomePage;
