import { Widget } from "@/features/widgetsSlice";
import { Easing } from "react-native-reanimated";
import { gap } from "./constants";

export const animationConfig = {
  easing: Easing.inOut(Easing.ease),
  duration: 350,
};

export const getAbsPosition = (
  gridNumber: number,
  height: number,
  gap: number,
  containerWidth: number,
) => {
  'worklet';
  const row = Math.floor(gridNumber / 2)
  const column = gridNumber % 2
  return {
    x: column * (containerWidth / 2) + gap,
    y: row * height + gap,
  };
}

// A grid number indicates the cell number that the left side of the widget is placed
// the numbers increment left to right and top to bottom. So a rectangle widget on the second
// row would have a grid number of three, since it's left side is in the third available cell
// 0 1
// 2 3
// 4 5
export const getGridPositions = (
  currentWidgets: Widget[],
  availableWidgets: Widget[]
) => {
  const currentWidgetsGridPositions = currentWidgets.reduce((gridNumbers, widget) => {
    const last = gridNumbers[gridNumbers.length - 1] || { row: 0, column: 0 }
    // - If the last shape was a rectangle, then there's no other choice but
    // to place the next shape on a new row, which would be two indexes past
    // the past shape.
    // - If the shape was then a square, the new shape can be placed in the next
    // index
    const gridNumber = last.shape === 'rectangle'
      ? last.gridNumber + 2
      : last.gridNumber + 1

    gridNumbers.push({
      key: widget.key,
      shape: widget.shape,
      gridNumber
    })
    return gridNumbers
  }, [] as { key: string, gridNumber: number, shape: 'square' | 'rectangle' }[])
  const availableWidgetsGridPositions = availableWidgets.reduce((gridNumbers, widget) => {

    // Shift the gridNumber by 1000 for an available widget
    const last = gridNumbers[gridNumbers.length - 1] || { gridNumber: 999 }

    const gridNumber = last.shape === 'rectangle'
      ? last.gridNumber + 2
      : last.gridNumber + 1

    gridNumbers.push({
      key: widget.key,
      shape: widget.shape,
      gridNumber
    })
    return gridNumbers
  }, [] as { key: string, gridNumber: number, shape: 'square' | 'rectangle' }[])

  return [
    ...currentWidgetsGridPositions,
    ...availableWidgetsGridPositions
  ]
}
