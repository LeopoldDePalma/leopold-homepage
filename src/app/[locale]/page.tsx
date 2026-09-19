import {useTranslations} from 'next-intl';

const HomePage = () => {
  const t = useTranslations('HomePage');

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold">{t('name')}</h1>
      <p className="mt-2 text-muted">{t('role')}</p>
    </main>
  );
};

export default HomePage;
