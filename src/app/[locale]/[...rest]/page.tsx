import {notFound} from 'next/navigation';

// Renders the 404 inside the locale layout instead of the bare built-in page.
const CatchAllPage = () => notFound();

export default CatchAllPage;
