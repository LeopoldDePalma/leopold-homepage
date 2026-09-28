import {indexOf, map} from 'lodash-es';

import {
  advance,
  createGame,
  type Game,
  getObstacleX,
  getScore,
  leap,
  OBSTACLE_KINDS,
  releaseLeap,
  WORLD,
} from './engine';

const FRAME = 1 / 60;
const LEAP_SECONDS = 0.5;

const LOWEST_ROLLS = {kind: 0, gap: 0};

const ride = (
  game: Game,
  seconds: number,
  onFrame?: (game: Game) => Game,
  rolls = LOWEST_ROLLS,
) => {
  let current = game;

  for (let elapsed = 0; elapsed < seconds; elapsed += FRAME) {
    current = advance(onFrame ? onFrame(current) : current, FRAME, rolls);
  }

  return current;
};

const peakHeight = (game: Game, seconds: number, onFrame?: (game: Game) => Game) => {
  let peak = 0;

  ride(game, seconds, (current) => {
    peak = Math.max(peak, current.height);

    return onFrame ? onFrame(current) : current;
  });

  return peak;
};

describe('joust engine', () => {
  it('waits for the first leap before riding', () => {
    const idle = ride(createGame(), 1);

    expect(idle.phase).toBe('ready');
    expect(idle.distance).toBe(0);
    expect(leap(idle).phase).toBe('running');
  });

  it('lands the leap back on the ground', () => {
    const landed = ride(leap(createGame()), 0.6);

    expect(landed.height).toBe(0);
    expect(landed.velocity).toBe(0);
  });

  it('keeps the leap through a frame that took no time', () => {
    const leaping = advance(leap(createGame()), 0, LOWEST_ROLLS);

    expect(advance(leaping, FRAME, LOWEST_ROLLS).height).toBeGreaterThan(0);
  });

  it('hops lower when the leap is released early', () => {
    const held = peakHeight(leap(createGame()), 0.5);
    const released = peakHeight(leap(createGame()), 0.5, releaseLeap);

    expect(released).toBeLessThan(held / 2);
  });

  it('does not leap again in mid-air', () => {
    const airborne = ride(leap(createGame()), 0.1);

    expect(leap(airborne)).toBe(airborne);
  });

  it('speeds up to a top speed', () => {
    const open = {...leap(createGame()), nextSpawnAt: Infinity};
    const late = ride(open, 70);

    expect(ride(open, 1).speed).toBeGreaterThan(open.speed);
    expect(ride(late, 10).speed).toBe(late.speed);
  });

  it('brings obstacles in from the right edge, more than a leap apart', () => {
    const game = ride(leap(createGame()), 2);
    const [nearer = 0, farther = 0] = map(game.obstacles, (obstacle) =>
      getObstacleX(game, obstacle),
    );

    expect(game.obstacles).toHaveLength(2);
    expect(farther).toBeLessThanOrEqual(WORLD.width);
    expect(farther - nearer).toBeGreaterThan(game.speed * LEAP_SECONDS);
  });

  it('unseats the knight who rides into an obstacle', () => {
    expect(ride(leap(createGame()), 5).phase).toBe('over');
  });

  it.each(OBSTACLE_KINDS)('lets a timely leap clear the %s at the starting speed', (kind) => {
    const index = indexOf(OBSTACLE_KINDS, kind);
    const kindRolls = {kind: (index + 0.5) / OBSTACLE_KINDS.length, gap: 0};

    const leapNearObstacle = (game: Game) => {
      const [next] = game.obstacles;
      const near = next !== undefined && getObstacleX(game, next) < 60;

      return near ? leap(game) : game;
    };

    const game = ride(leap(createGame()), 5, leapNearObstacle, kindRolls);

    expect(game.phase).toBe('running');
    expect(getScore(game)).toBeGreaterThan(40);
  });

  it('starts a fresh ride after a fall', () => {
    const fallen = ride(leap(createGame()), 5);
    const again = leap(fallen);

    expect(again.phase).toBe('running');
    expect(again.distance).toBe(0);
    expect(again.obstacles).toEqual([]);
  });

  it('does not move the knight further after a stalled frame', () => {
    const riding = leap(createGame());

    expect(advance(riding, 3, LOWEST_ROLLS).distance).toBe(
      advance(riding, 0.05, LOWEST_ROLLS).distance,
    );
  });
});
