import React, { useEffect, useState } from 'react';
import { PacmanLoader } from 'react-spinners';
import styles from './Loader.module.css';

type LoaderProps = {
  children?: React.ReactNode;
  loadingDuration?: number;
};

export default function Loader({
  children,
  loadingDuration = 2000,
}: LoaderProps): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, loadingDuration);

    return () => clearTimeout(timer);
  }, [loadingDuration]);

  return (
    <>
      {isLoading ? (
        <div className={styles.loader}>
          <PacmanLoader loading size={20} />
        </div>
      ) : (
        children
      )}
    </>
  );
}
