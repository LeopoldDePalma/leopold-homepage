import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import useAppRoutes from './lib/useAppRoutes';

export default function AppRouterProvider(): React.JSX.Element {
  const routes = useAppRoutes();
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
}
