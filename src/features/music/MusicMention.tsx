'use client';

import {chakra, type HTMLChakraProps} from '@chakra-ui/react';

import {useMusicPanelStore} from './musicPanelStore';

export const MusicMention = (props: Omit<HTMLChakraProps<'button'>, 'type' | 'onClick'>) => {
  const setOpen = useMusicPanelStore((state) => state.setOpen);

  const handleClick = () => setOpen(true);

  return <chakra.button type="button" onClick={handleClick} {...props} />;
};
