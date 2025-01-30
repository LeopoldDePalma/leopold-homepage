import { Box, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import styles from './TypeText.module.css';

type TypedTextProps = {
  strings: string[];
  typeSpeed?: number;
  backSpeed?: number;
  startDelay?: number;
  loop?: boolean;
};

export default function TypeText({
  strings,
  typeSpeed = 50,
  backSpeed = 25,
  startDelay = 500,
  loop = true,
}: TypedTextProps): React.JSX.Element {
  const typeRef = useRef<HTMLDivElement | null>(null);
  const stringsRefElement = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeRef.current && stringsRefElement.current) {
      const options = {
        typeSpeed,
        backSpeed,
        startDelay,
        loop,
        stringsElement: stringsRefElement.current as HTMLElement,
      };

      const typed = new Typed(typeRef.current as HTMLElement, options);

      return () => typed.destroy();
    }
    return undefined;
  }, [backSpeed, loop, startDelay, typeSpeed]);

  return (
    <>
      <Typography variant="h1" ref={typeRef} className={styles.typeText} />
      <Box ref={stringsRefElement}>
        {strings.map((string) => (
          <Typography key={string}>{string}</Typography>
        ))}
      </Box>
    </>
  );
}
