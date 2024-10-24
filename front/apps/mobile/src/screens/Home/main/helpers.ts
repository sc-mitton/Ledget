import { SharedValue } from "react-native-reanimated";

import { Widget } from "@/features/widgetsSlice";
import { Easing } from "react-native-reanimated";
import { gap } from "./constants";

const PROXIMITY_THRESHOLD = 0.25;

export const getPositionsMap = (widgets: Widget[]) => {
  const positionEntries = getGridPositions(widgets).map((gridPosition, index) =>
    [widgets[index].id || widgets[index].type, gridPosition] as [string, number]
  )
  return Object.fromEntries(positionEntries)
}

// The grid position indicates the cell number that the left side of the widget is placed
// the numbers increment left to right and top to bottom. So a rectangle widget on the second
// row would have a grid position of three, since it's left side is in the third available cell
// 0 1
// 2 3
// 4 5
export const getGridPositions = (widgets: Widget[]) => {
  'worklet';

  // Shift widgets without an id by 1000 to indicate an overlayed grid
  const shift = widgets.every(w => !w.id) ? 1000 : 0

  const acc = {
    last: null,
    gridPositions: []
  } as { last: Widget | null, gridPositions: number[] }

  const gridPositions = widgets.reduce((acc, w) => {
    if (acc.gridPositions.length === 0) {
      acc.gridPositions.push(shift)
      acc.last = w
      return acc
    }

    const lastGridPosition = isNaN(acc.gridPositions[acc.gridPositions.length - 1])
      ? shift
      : acc.gridPositions[acc.gridPositions.length - 1]

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
  }, acc).gridPositions

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

// Get the number of grid positions up/down and left/right to shift the widget
export const getNewGridPosition = (
  widget: Widget,
  positions: SharedValue<{ [id: string]: number }>,
  td: { x: number, y: number },
  height: number
) => {
  'worklet';

  const gridPosition = positions.value[widget.id || widget.type] >= 1000
    ? positions.value[widget.id || widget.type] - 1000
    : positions.value[widget.id || widget.type]

  const width = widget.shape === 'square' ? height : (height * 2) + gap

  const x = ((td.x - gap) + (width + gap)) / (width + gap);
  const y = (td.y + height) / height;

  const proximityY = Math.abs(Math.round(y) - y)
  const proximityX = Math.abs(Math.round(x) - x)

  const row = proximityY < PROXIMITY_THRESHOLD
    ? Math.round(y) - 1
    : Math.round(gridPosition / 2)

  const col = proximityX < PROXIMITY_THRESHOLD
    ? Math.round(x) - 1
    : gridPosition % 2

  return Math.min(row * 2 + col, Object.keys(positions.value).length - 1)
}
