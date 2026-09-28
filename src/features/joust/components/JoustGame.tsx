'use client';

import {chakra, Span, VisuallyHidden} from '@chakra-ui/react';
import {clamp, map} from 'lodash-es';
import {useTranslations} from 'next-intl';
import {useId} from 'react';

import {KNIGHT_DRAWING, OBSTACLE_DRAWINGS} from '@/features/joust/art';
import {PlacedDrawing} from '@/features/joust/components/PlacedDrawing';
import {
  type Game,
  getObstacleX,
  KNIGHT_HEIGHT,
  KNIGHT_X,
  OBSTACLE_HEIGHTS,
  WORLD,
} from '@/features/joust/engine';
import {useJoust} from '@/features/joust/hooks/useJoust';

const PEBBLES = {width: 64, height: 8};
const STRIDE = {length: 12, bounce: 1.5};
const PITCH = {perVelocity: 1 / 40, limit: 6};

const formatScore = (score: number) => String(score).padStart(5, '0');

const getKnightPose = ({phase, height, velocity, distance}: Game) => {
  if (height > 0) {
    return {lift: height, tilt: clamp(-velocity * PITCH.perVelocity, -PITCH.limit, PITCH.limit)};
  }

  const stride = Math.abs(Math.sin((distance / STRIDE.length) * Math.PI));

  return {lift: phase === 'running' ? stride * STRIDE.bounce : 0, tilt: 0};
};

export const JoustGame = () => {
  const t = useTranslations('JoustGame');
  const {
    game,
    best,
    score,
    running,
    over,
    fieldRef,
    handleKeyDown,
    handleKeyUp,
    handlePointerDown,
    handlePointerUp,
    handleClick,
  } = useJoust();
  const hintId = useId();
  const pebblesId = useId();

  const knight = getKnightPose(game);

  return (
    <>
      <chakra.button
        ref={fieldRef}
        aria-label={t('label')}
        aria-describedby={hintId}
        display="grid"
        gap="2"
        w="full"
        p="4"
        borderWidth="1px"
        rounded="l3"
        borderColor="border"
        cursor="pointer"
        userSelect="none"
        touchAction="manipulation"
        focusVisibleRing="outside"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleClick}
      >
        <Span
          aria-hidden
          display="flex"
          justifyContent="end"
          gap="4"
          textStyle="xs"
          fontVariantNumeric="tabular-nums"
        >
          <Span color="fg.muted">
            {t('best')} {formatScore(best)}
          </Span>
          <Span color="accent">{formatScore(score)}</Span>
        </Span>
        <Span display="grid">
          <chakra.svg
            viewBox={`0 0 ${String(WORLD.width)} ${String(WORLD.height)}`}
            display="block"
            w="full"
            fill="currentColor"
            _rtl={{transform: 'scaleX(-1)'}}
          >
            <defs>
              <pattern
                id={pebblesId}
                y={WORLD.ground}
                width={PEBBLES.width}
                height={PEBBLES.height}
                patternUnits="userSpaceOnUse"
                patternTransform={`translate(${String(-(game.distance % PEBBLES.width))} 0)`}
              >
                <rect x="3" y="3" width="2" height="1" />
                <rect x="19" y="6" width="1" height="1" />
                <rect x="30" y="2" width="3" height="1" />
                <rect x="51" y="4" width="1" height="1" />
              </pattern>
            </defs>
            <rect y={WORLD.ground} width={WORLD.width} height="1" />
            <rect
              y={WORLD.ground}
              width={WORLD.width}
              height={PEBBLES.height}
              fill={`url(#${pebblesId})`}
            />
            {map(game.obstacles, (obstacle) => (
              <PlacedDrawing
                key={obstacle.spawnedAt}
                drawing={OBSTACLE_DRAWINGS[obstacle.kind]}
                x={getObstacleX(game, obstacle)}
                bottom={WORLD.ground}
                height={OBSTACLE_HEIGHTS[obstacle.kind]}
              />
            ))}
            <PlacedDrawing
              drawing={KNIGHT_DRAWING}
              x={KNIGHT_X}
              bottom={WORLD.ground - knight.lift}
              height={KNIGHT_HEIGHT}
              tilt={knight.tilt}
            />
          </chakra.svg>
          <Span
            gridArea="1 / 1"
            alignSelf="start"
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap="1"
            textAlign="center"
            visibility={running ? 'hidden' : 'visible'}
          >
            {over && (
              <Span fontFamily="heading" fontSize="lg" fontWeight="bold">
                {t('slain')}
              </Span>
            )}
            <Span id={hintId} textStyle="xs" color="fg.muted">
              {t('hint')}
            </Span>
          </Span>
        </Span>
      </chakra.button>
      <VisuallyHidden role="status" aria-atomic>
        {over && `${t('slain')} ${t('result', {score: String(score)})}`}
      </VisuallyHidden>
    </>
  );
};
