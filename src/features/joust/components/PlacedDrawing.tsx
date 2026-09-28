import {join} from 'lodash-es';

import {type Drawing, getDrawnWidth, ICON_GRID} from '@/features/joust/art';

type PlacedDrawingProps = {
  drawing: Drawing;
  x: number;
  bottom: number;
  height: number;
  tilt?: number;
};

export const PlacedDrawing = ({drawing, x, bottom, height, tilt = 0}: PlacedDrawingProps) => {
  const {Icon, box} = drawing;
  const scale = height / box.height;
  const centre = x + getDrawnWidth(drawing, height) / 2;
  const origin = {x: box.x + box.width / 2, y: box.y + box.height};
  const transform = join(
    [
      `translate(${String(centre)} ${String(bottom)})`,
      `rotate(${String(tilt)})`,
      `scale(${String(scale)})`,
      `translate(${String(-origin.x)} ${String(-origin.y)})`,
    ],
    ' ',
  );

  return (
    <g transform={transform}>
      <Icon size={ICON_GRID} />
    </g>
  );
};
