import {notFound} from 'next/navigation';

/**
 * Every unmatched address lands here so the 404 renders inside the locale layout, with the
 * site header, theme and translations, instead of the bare built-in page.
 */
const CatchAllPage = () => {
  notFound();
};

export default CatchAllPage;
