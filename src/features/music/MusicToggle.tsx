'use client';

import {
  HStack,
  Icon,
  IconButton,
  Image,
  Popover,
  Portal,
  Stack,
  Status,
  Text,
} from '@chakra-ui/react';
import {IconBrandSpotify} from '@tabler/icons-react';
import {useFormatter, useTranslations} from 'next-intl';
import {useShallow} from 'zustand/shallow';

import {ExternalLink} from '@/components/ui/ExternalLink';
import {useMusicPanelStore} from '@/features/music/store/musicPanelStore';

import type {Listening} from './spotify';
import {useListening} from './useListening';

export const MusicToggle = ({initial}: {initial: Listening}) => {
  const t = useTranslations('Music');
  const format = useFormatter();
  const [open, setOpen] = useMusicPanelStore(useShallow((state) => [state.open, state.setOpen]));
  const listening = useListening(initial, open);

  const status = listening.playing ? t('title') : t('lastPlayed');

  const handleOpenChange = (details: Popover.OpenChangeDetails) => setOpen(details.open);

  return (
    <Popover.Root
      open={open}
      onOpenChange={handleOpenChange}
      positioning={{placement: 'bottom-end'}}
    >
      <Popover.Trigger asChild>
        <IconButton aria-label={status} variant="outline" size="sm">
          <Icon>
            <IconBrandSpotify />
          </Icon>
        </IconButton>
      </Popover.Trigger>

      <Portal>
        <Popover.Positioner>
          <Popover.Content w="xs" maxW="calc(100vw - 2rem)" p="3" textStyle="sm">
            <HStack gap="3">
              {listening.cover ? (
                <Image
                  src={listening.cover}
                  alt=""
                  boxSize="14"
                  flexShrink="0"
                  rounded="md"
                  borderWidth="1px"
                />
              ) : null}

              <Stack gap="0.5" minW="0">
                <Status.Root
                  size="sm"
                  gap="0.4em"
                  letterSpacing="wide"
                  textTransform="uppercase"
                  color="fg.muted"
                >
                  <Status.Indicator
                    bg="accent"
                    animation={listening.playing ? 'pulse' : undefined}
                    _motionReduce={{animation: 'none'}}
                  />
                  {status}
                </Status.Root>
                <ExternalLink
                  href={listening.url}
                  display="block"
                  minW="0"
                  color="fg"
                  _hover={{color: 'accent', textDecoration: 'none'}}
                >
                  <Text as="span" display="block" truncate fontWeight="medium">
                    {listening.track}
                  </Text>
                  <Text as="span" display="block" truncate color="fg.muted">
                    {format.list(listening.artists, {type: 'conjunction'})}
                  </Text>
                </ExternalLink>
              </Stack>
            </HStack>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};
