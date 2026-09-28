import {includes} from 'lodash-es';
import {type KeyboardEvent, useEffect, useRef, useState} from 'react';
import {useShallow} from 'zustand/shallow';

import {advance, createGame, type Game, getScore, leap, releaseLeap} from '@/features/joust/engine';
import {useBestScoreStore} from '@/features/joust/store/bestScoreStore';
import {useOnScreen} from '@/lib/hooks/useOnScreen';

const LEAP_KEYS = [' ', 'ArrowUp'];

const start = (game: Game) => (game.phase === 'running' ? game : leap(game));

export const useJoust = () => {
  const [best, record] = useBestScoreStore(useShallow((state) => [state.best, state.record]));
  const [game, setGame] = useState(createGame);
  const fieldRef = useRef<HTMLButtonElement>(null);
  const onScreen = useOnScreen(fieldRef);

  const running = game.phase === 'running';
  const over = game.phase === 'over';
  const score = getScore(game);

  useEffect(() => {
    void useBestScoreStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (over) {
      record(score);
    }
  }, [over, score, record]);

  useEffect(() => {
    if (!running || !onScreen) {
      return;
    }

    let frame = 0;
    let previous: number | undefined;

    const tick = (time: number) => {
      const seconds = (time - (previous ?? time)) / 1000;
      const rolls = {kind: Math.random(), gap: Math.random()};

      setGame((current) => advance(current, seconds, rolls));
      previous = time;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [running, onScreen]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!includes(LEAP_KEYS, event.key)) {
      return;
    }

    event.preventDefault();

    if (!event.repeat) {
      setGame(leap);
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (includes(LEAP_KEYS, event.key)) {
      setGame(releaseLeap);
    }
  };

  const handlePointerDown = () => setGame(leap);
  const handlePointerUp = () => setGame(releaseLeap);
  const handleClick = () => setGame(start);

  return {
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
  };
};
