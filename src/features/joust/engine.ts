import {reject, some} from 'lodash-es';

import {getDrawnWidth, OBSTACLE_DRAWINGS} from './art';

export const WORLD = {width: 240, height: 80, ground: 72};
export const KNIGHT_X = 12;
export const KNIGHT_HEIGHT = 32;

export const OBSTACLE_KINDS = ['barrel', 'stakes', 'caltrops'] as const;

export type ObstacleKind = (typeof OBSTACLE_KINDS)[number];

export const OBSTACLE_HEIGHTS: Record<ObstacleKind, number> = {
  barrel: 15,
  stakes: 16,
  caltrops: 10,
};

const GRAVITY = 1320;
const LEAP_VELOCITY = 300;
const HOP_VELOCITY = 200;
const START_SPEED = 150;
const TOP_SPEED = 330;
const ACCELERATION = 3;
const LONGEST_TICK = 0.05;
const SHORTEST_GAP = 0.9;
const GAP_SPREAD = 1;
const DISTANCE_PER_POINT = 15;
const HITBOX = {start: KNIGHT_X + 9, end: KNIGHT_X + 24, forgiveness: 1};

export type Obstacle = {kind: ObstacleKind; spawnedAt: number};

export type Rolls = {kind: number; gap: number};

export type Game = {
  phase: 'ready' | 'running' | 'over';
  distance: number;
  speed: number;
  height: number;
  velocity: number;
  obstacles: Obstacle[];
  nextSpawnAt: number;
};

export const createGame = (): Game => ({
  phase: 'ready',
  distance: 0,
  speed: START_SPEED,
  height: 0,
  velocity: 0,
  obstacles: [],
  nextSpawnAt: 0,
});

export const getObstacleX = (game: Game, obstacle: Obstacle) =>
  WORLD.width - (game.distance - obstacle.spawnedAt);

export const getScore = (game: Game) => Math.floor(game.distance / DISTANCE_PER_POINT);

export const leap = (game: Game): Game => {
  if (game.phase === 'over') {
    return {...createGame(), phase: 'running'};
  }

  if (game.height > 0) {
    return game;
  }

  return {...game, phase: 'running', velocity: LEAP_VELOCITY};
};

export const releaseLeap = (game: Game): Game => ({
  ...game,
  velocity: Math.min(game.velocity, HOP_VELOCITY),
});

const getObstacleWidth = ({kind}: Obstacle) =>
  getDrawnWidth(OBSTACLE_DRAWINGS[kind], OBSTACLE_HEIGHTS[kind]);

const isHit = (game: Game, obstacle: Obstacle) => {
  const start = getObstacleX(game, obstacle) + HITBOX.forgiveness;
  const end = start + getObstacleWidth(obstacle) - 2 * HITBOX.forgiveness;
  const top = OBSTACLE_HEIGHTS[obstacle.kind] - HITBOX.forgiveness;

  return start < HITBOX.end && end > HITBOX.start && game.height < top;
};

const spawnObstacle = (game: Game, rolls: Rolls): Game => {
  const kind = OBSTACLE_KINDS[Math.floor(rolls.kind * OBSTACLE_KINDS.length)] ?? 'barrel';
  const gap = game.speed * (SHORTEST_GAP + rolls.gap * GAP_SPREAD);

  return {
    ...game,
    obstacles: [...game.obstacles, {kind, spawnedAt: game.distance}],
    nextSpawnAt: game.distance + gap,
  };
};

export const advance = (game: Game, seconds: number, rolls: Rolls): Game => {
  if (game.phase !== 'running') {
    return game;
  }

  const tick = Math.min(seconds, LONGEST_TICK);
  const speed = Math.min(game.speed + ACCELERATION * tick, TOP_SPEED);
  const velocity = game.velocity - GRAVITY * tick;
  const height = game.height + velocity * tick;
  const landed = height < 0;
  const moved: Game = {
    ...game,
    distance: game.distance + speed * tick,
    speed,
    height: landed ? 0 : height,
    velocity: landed ? 0 : velocity,
  };
  const ahead: Game = {
    ...moved,
    obstacles: reject(
      moved.obstacles,
      (obstacle) => getObstacleX(moved, obstacle) + getObstacleWidth(obstacle) < 0,
    ),
  };
  const next = ahead.distance >= ahead.nextSpawnAt ? spawnObstacle(ahead, rolls) : ahead;

  return some(next.obstacles, (obstacle) => isHit(next, obstacle))
    ? {...next, phase: 'over'}
    : next;
};
