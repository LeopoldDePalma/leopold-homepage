import {Heading, Stack} from '@chakra-ui/react';
import type {ReactNode} from 'react';

export const Section = ({title, children}: {title: string; children: ReactNode}) => (
  <Stack as="section" gap="3">
    <Heading
      as="h2"
      fontSize="2xl"
      textDecoration="underline"
      textDecorationColor="accent/50"
      textDecorationThickness="0.12em"
      textUnderlineOffset="0.3em"
    >
      {title}
    </Heading>
    {children}
  </Stack>
);
