import {SiteDocument} from '@/components/layout/SiteDocument';
import {getSiteMetadata} from '@/components/layout/siteMetadata';
import {NotFound} from '@/features/not-found/NotFound';

export const generateMetadata = getSiteMetadata;

const GlobalNotFound = () => (
  <SiteDocument>
    <NotFound />
  </SiteDocument>
);

export default GlobalNotFound;
