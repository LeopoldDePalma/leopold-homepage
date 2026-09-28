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
import {useEffect, useState} from 'react';

import {ExternalLink} from '@/components/ui/ExternalLink';

import {useMusicPanelStore} from './musicPanelStore';
import type {Listening} from './spotify';

const MUSIC_URL = '/api/music';

export const MusicToggle = ({initial}: {initial: Listening}) => {
  const t = useTranslations('Music');
  const format = useFormatter();
  const [listening, setListening] = useState(initial);
  const isOpen = useMusicPanelStore((state) => state.isOpen);
  const setOpen = useMusicPanelStore((state) => state.setOpen);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const refresh = async () => {
      const response = await fetch(MUSIC_URL);
      const fresh = response.ok ? ((await response.json()) as Listening | null) : null;

      if (fresh) {
        setListening(fresh);
      }
    };

    refresh().catch(console.warn);
  }, [isOpen]);

  const handleOpenChange = ({open}: Popover.OpenChangeDetails) => setOpen(open);

  const status = listening.isPlaying ? t('title') : t('lastPlayed');

  return (
    <Popover.Root
      open={isOpen}
      onOpenChange={handleOpenChange}
      positioning={{placement: 'bottom-end'}}
    >
      <Popover.Trigger asChild>
        <IconButton aria-label={status} variant="outline" size="sm">
          <Icon asChild>
            <IconBrandSpotify aria-hidden />
          </Icon>
        </IconButton>
      </Popover.Trigger>

      <Portal>
        <Popover.Positioner>
          <Popover.Content w="xs" maxW="calc(100vw - 2rem)" p="3" textStyle="sm">
            <HStack gap="3">
              {listening.cover ? (
                <Image
                  src={listening.cover.url}
                  alt=""
                  width={listening.cover.size}
                  height={listening.cover.size}
                  boxSize="14"
                  flexShrink="0"
                  rounded="md"
                  borderWidth="1px"
                  objectFit="cover"
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
                    animation={listening.isPlaying ? 'pulse' : undefined}
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
