import { SharedValue } from "react-native-reanimated";

import { Widget } from "@/features/widgetsSlice";
import { Easing } from "react-native-reanimated";
import { gap } from "./constants";

// const PROXIMITY_THRESHOLD = 0.1;

export const animationConfig = {
  easing: Easing.inOut(Easing.ease),
  duration: 350,
};


// The grid position indicates the cell number that the left side of the widget is placed
// the numbers increment left to right and top to bottom. So a rectangle widget on the second
// row would have a grid position of three, since it's left side is in the third available cell
// 0 1
// 2 3
// 4 5
export const getGridPositions = (widgets: Widget[]) => {


  // Shift widgets without an id by 1000 to indicate an overlayed grid
  const acc = {
    last: null,
    gridPositions: [widgets.every(w => !w.id) ? 999 : 0]
  } as { last: Widget | null, gridPositions: number[] }

  const gridPositions = widgets.reduce((acc, w) => {
    const lastGridPosition = acc.gridPositions[acc.gridPositions.length - 1]
    // Four possible scenarios
    // 1. Last widget was square and current widget is square, place widget in next slot (+1)
    // 2. Last widget was square and current widget is rectangle
    //    a. If the last widget was in right column, then new widget can go in next slot (+1)
    //    b. If the last widget was in left column, then there's not enough room on the current
    //       row, and it needs to be placed on the next row (+2)
    // 3. Last widget was rectangle, widget will have to be on new row either way
    const gridPosition = acc.last?.shape === 'square' || !acc.last
      ? w.shape === 'square'
        ? lastGridPosition + 1
        : lastGridPosition % 2 === 1
          ? lastGridPosition + 1
          : lastGridPosition + 2
      : 2

    acc.gridPositions.push(gridPosition)
    acc.last = w

    return acc
  }, acc).gridPositions.slice(1)

  return gridPositions
}


export const getAbsPosition = (position: number, height: number) => {
  'worklet';

  const gridPosition = position >= 1000 ? position - 1000 : position

  const column = gridPosition % 2
  const row = Math.floor(gridPosition / 2)

  return {
    x: column * (height + gap),
    y: row * (height + gap),
  };
}

// export const getUpdatedGridPos = (
//   { widget, currentIndex, max, td, height, containerWidth }:
//     {
//       widget: Widget,
//       currentIndex: number,
//       max: number,
//       td: { tx: number, ty: number },
//       height: number,
//       containerWidth: number
//     }
// ) => {

//   const width = widget.shape === 'square'
//     ? (containerWidth / 2) - gap
//     : containerWidth

//   const x = ((td.tx - gap) + (width + gap)) / (width + gap);
//   const y = (td.ty + height) / height;

//   const proximityY = Math.abs(Math.round(y) - y)
//   const proximityX = Math.abs(Math.round(x) - x)

//   const row = proximityY < PROXIMITY_THRESHOLD
//     ? Math.round(y) - 1
//     : Math.round(currentIndex / 2)

//   const col = proximityX < PROXIMITY_THRESHOLD
//     ? Math.round(x) - 1
//     : currentIndex % 2

//   return Math.min(row * 2 + col, max);
// }
