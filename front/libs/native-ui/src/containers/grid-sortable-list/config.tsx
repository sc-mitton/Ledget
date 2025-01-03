import { Easing } from 'react-native-reanimated';

const PROXIMITY_THRESHOLD = 0.1;

export const animationConfig = {
  easing: Easing.inOut(Easing.ease),
  duration: 350,
};

export const getPosition = (
  position: number,
  width: number,
  height: number,
  column: number,
  containerWidth: number
) => {
  'worklet';

  // If you find the total width not taken up by the items
  // and divide it by the number of columns, this is the gap that should
  // be between each item horizontally.
  const columnGap = (containerWidth - width * column) / (column + 1);

  return {
    x: (position % column) * width + columnGap * ((position % column) + 1),
    y: Math.floor(position / column) * height,
  };
};

export const getUpdatedIndex = ({
  index,
  td,
  max,
  size,
  column,
  containerWidth,
}: {
  index: number;
  td: { tx: number; ty: number };
  max: number;
  size: { width: number; height: number };
  column: number;
  containerWidth: number;
}) => {
  'worklet';

  const columnGap = (containerWidth - size.width * column) / (column + 1);
  const x =
    (td.tx - columnGap + (size.width + columnGap)) / (size.width + columnGap);
  const y = (td.ty + size.height) / size.height;

  const proximityY = Math.abs(Math.round(y) - y);
  const proximityX = Math.abs(Math.round(x) - x);

  const row =
    proximityY < PROXIMITY_THRESHOLD
      ? Math.round(y) - 1
      : Math.round(index / column);

  const col =
    proximityX < PROXIMITY_THRESHOLD ? Math.round(x) - 1 : index % column;

  return Math.min(row * column + col, max);
};
