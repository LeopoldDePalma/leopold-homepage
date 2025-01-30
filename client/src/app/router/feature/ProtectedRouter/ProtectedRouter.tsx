import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

type ProtectedRouterProps = {
  children?: React.JSX.Element;
  isAllowed: boolean;
  redirectTo: string;
};

export default function ProtectedRouter({
  children,
  isAllowed,
  redirectTo,
}: ProtectedRouterProps): React.JSX.Element {
  if (!isAllowed) return <Navigate to={redirectTo} />;
  return children ?? <Outlet />;
}
