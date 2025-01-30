import { Suspense } from 'react';
import { type RouteObject } from 'react-router-dom';
import ErrorPage from '../../../pages/ErrorPage/ui/ErrorPage.js';
import MainPage from '../../../pages/MainPage/ui/MainPage.js';
import Loader from '../../../widgets/Loader/ui/Loader.js';
import Layout from '../../layout/ui/Layout.js';

const LazyLoadWrapper = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
  <Suspense fallback={<Loader loadingDuration={1000} />}>{children}</Suspense>
);

export default function useAppRoutes(): RouteObject[] {
  return [
    {
      path: '/',
      element: (
        <LazyLoadWrapper>
          <Layout />
        </LazyLoadWrapper>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: (
            <LazyLoadWrapper>
              <MainPage />
            </LazyLoadWrapper>
          ),
        },
        // {
        //   path: 'work',
        //   element: <WorksPage />,
        // },
        // {
        //   path: 'posts',
        //   element: <PostsPage />,
        // },
        // {
        //   path: 'uses',
        //   element: <UsesPage />,
        // },
        // {
        //   path: 'source',
        //   element: <SourcePage />,
        // },
        {
          path: '*',
          element: <ErrorPage />,
        },
      ],
    },
  ];
}
