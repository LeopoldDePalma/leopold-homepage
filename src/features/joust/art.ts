import type {IconType} from 'react-icons';
import {GiBarrel, GiCaltrops, GiMountedKnight, GiStakesFence} from 'react-icons/gi';

import type {ObstacleKind} from './engine';

export type Drawing = {Icon: IconType; box: {x: number; y: number; width: number; height: number}};

export const ICON_GRID = 512;

export const knightDrawing: Drawing = {
  Icon: GiMountedKnight,
  box: {x: 18, y: 31, width: 476, height: 451},
};

export const obstacleDrawings: Record<ObstacleKind, Drawing> = {
  barrel: {Icon: GiBarrel, box: {x: 73, y: 41, width: 366, height: 434}},
  stakes: {Icon: GiStakesFence, box: {x: 22, y: 21, width: 468, height: 470}},
  caltrops: {Icon: GiCaltrops, box: {x: 29, y: 20, width: 455, height: 470}},
};

export const getDrawnWidth = ({box}: Drawing, height: number) => (box.width * height) / box.height;
