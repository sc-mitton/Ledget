import { useDrag } from '@use-gesture/react';
import { clamp } from 'lodash-es';

interface UseItemsDrag {
  (args: {
    order: React.MutableRefObject<string[]>;
    indexCol?: string;
    api: any;
    onRest?: (newOrder: string[]) => void;
    onDrag?: (index: number, p: number) => void;
    offset?: React.MutableRefObject<number>;
    style: {
      axis: 'x' | 'y';
      size: number;
      padding: number;
    };
    activeScale?: number;
  }): any;
}

interface AnimationT {
  y?: number;
  x?: number;
  scale?: number;
  zIndex: number;
  immediate: false | ((key: any) => boolean);
}

function swap<T>(array: T[], moveIndex: number, toIndex: number): T[] {
  /* #move - Moves an array item from one position in an array to another.
        Note: This is a pure function, so a new array will be returned instead of altering the array argument.
        Arguments:
        1. array     (T[]) : Array in which to move an item.         (required)
        2. moveIndex (number) : The index of the item to move.          (required)
        3. toIndex   (number) : The index to move the item at moveIndex to. (required)
    */
  const item = array[moveIndex];
  const length = array.length;
  const diff = moveIndex - toIndex;

  if (diff > 0) {
    // move left
    return [
      ...array.slice(0, toIndex),
      item,
      ...array.slice(toIndex, moveIndex),
      ...array.slice(moveIndex + 1, length),
    ];
  } else if (diff < 0) {
    // move right
    return [
      ...array.slice(0, moveIndex),
      ...array.slice(moveIndex + 1, toIndex + 1),
      item,
      ...array.slice(toIndex + 1, length),
    ];
  }
  return array;
}

const useSpringDrag: UseItemsDrag = ({
  order,
  indexCol = 'id',
  api,
  style,
  activeScale,
  onDrag,
  onRest,
}) => {
  return useDrag(({ args: [itemId], active, movement: [x, y] }) => {
    if (
      document.activeElement?.getAttribute('draggable-item') === null ||
      !document.activeElement
    ) {
      return;
    }
    const curIndex = order.current.indexOf(itemId);
    const curPosition = clamp(
      style.axis === 'x'
        ? Math.round((curIndex * style.size + x) / style.size)
        : Math.round((curIndex * style.size + y) / style.size),
      0,
      order.current.length - 1
    );

    const newOrder = swap<string>(order.current, curIndex, curPosition);
    api.start((index: number, item: any) => {
      let animation = {} as AnimationT;

      if (active && item._item[indexCol] === itemId) {
        const delta = style.axis === 'x' ? x : y;
        const pos = Math.min(
          Math.max(curIndex * (style.size + style.padding) + delta, 0),
          (newOrder.length - 1) * (style.size + style.padding)
        );
        const xImmediate = (key: any) => key === 'x' || key === 'zIndex';
        const yImmediate = (key: any) => key === 'y' || key === 'zIndex';
        animation['immediate'] = style.axis === 'x' ? xImmediate : yImmediate;
        animation['zIndex'] = 1;
        animation['scale'] = activeScale;
        if (style.axis === 'x') {
          animation['x'] = pos;
        } else {
          animation['y'] = pos;
        }
      } else {
        const pos =
          newOrder.indexOf(item._item[indexCol]) * (style.size + style.padding);
        if (style.axis === 'x') {
          animation['x'] = pos;
        } else {
          animation['y'] = pos;
        }
        animation['zIndex'] = 0;
        animation['immediate'] = false;
        animation['scale'] = 1;
      }
      return {
        to: animation,
        onChange: () => {
          if (
            active &&
            ((style.axis === 'x' && x > 10) || (style.axis === 'y' && y > 10))
          ) {
            onDrag && onDrag(index, animation['x'] || animation['y'] || 0);
          }
        },
      };
    });
    if (!active && onRest) {
      onRest(newOrder);
    }
    if (!active) order.current = newOrder;
  });
};

export { useSpringDrag };
