'use client';

import {Box, HStack, Icon, IconButton, Image, Popover, Portal, Stack, Text} from '@chakra-ui/react';
import {IconBrandSpotify} from '@tabler/icons-react';
import {useFormatter, useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';

import {ExternalLink} from '@/components/ui/ExternalLink';

import {useMusicPanelStore} from './musicPanelStore';
import type {Listening} from './spotify';

const MUSIC_URL = '/api/music';

/**
 * Header button and the panel it opens. The track comes from the server for the first paint and
 * is fetched again whenever the panel opens — the one moment somebody is looking at it, so no
 * timer is needed. The "Music" word on the home page opens the same panel through the store.
 */
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
      try {
        const response = await fetch(MUSIC_URL);

        // An error page can be valid JSON, and casting it would break the next render.
        if (!response.ok) {
          return;
        }

        const fresh = (await response.json()) as Listening | null;

        if (fresh) {
          setListening(fresh);
        }
      } catch (error) {
        // Keep showing the track we already have, but do not swallow the reason.
        console.warn('Could not refresh the Spotify track', error);
      }
    };

    void refresh();
  }, [isOpen]);

  const handleOpenChange = ({open}: Popover.OpenChangeDetails) => {
    setOpen(open);
  };

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
                // Spotify's own artwork, served straight from their CDN.
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
                <HStack
                  gap="0.4em"
                  textStyle="xs"
                  letterSpacing="wide"
                  textTransform="uppercase"
                  color="fg.muted"
                >
                  {/* A steady dot for the last track, a pulsing one while the music is on. */}
                  <Box
                    aria-hidden
                    boxSize="0.5em"
                    flexShrink="0"
                    rounded="full"
                    bg="accent"
                    animation={listening.isPlaying ? 'pulse' : undefined}
                    _motionReduce={{animation: 'none'}}
                  />
                  {status}
                </HStack>
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
