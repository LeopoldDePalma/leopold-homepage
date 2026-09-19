import {useTranslations} from 'next-intl';
import {tv} from 'tailwind-variants';

const siteFooter = tv({
  base: ['mx-auto w-full max-w-2xl', 'px-4 py-8', 'text-center text-sm', 'text-muted'],
});

export const SiteFooter = () => {
  const tSite = useTranslations('Site');
  const t = useTranslations('SiteFooter');
  // Passed as a string so locales with digit grouping don't render "2,026".
  const year = String(new Date().getFullYear());

  return <footer className={siteFooter()}>{t('copyright', {year, name: tSite('name')})}</footer>;
};
