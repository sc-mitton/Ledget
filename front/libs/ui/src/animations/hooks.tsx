import { useDrag } from '@use-gesture/react'
import clamp from 'lodash.clamp'

interface Item {
    item: any,
    [key: string]: any;
}

interface UseItemsDrag {
    (args: {
        items: Item[],
        updateOrder: (items: Item[]) => void,
        api: any,
        style: {
            axis: 'x' | 'y'
            size: number,
            padding: number,
        }
    }): any
}

function _toConsumableArray<T>(arr: T[] | ArrayLike<T>): T[] {
    if (Array.isArray(arr)) {
        return [...arr];
    } else {
        return Array.from(arr);
    }
}

function move<T>(array: T[], moveIndex: number, toIndex: number): T[] {
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


function swapArrayLocs<T>(arr: T[], index1: number, index2: number): T[] {
    const newArr = [...arr]
    const temp = newArr[index1]
    newArr[index1] = newArr[index2]
    newArr[index2] = temp
    return newArr
}

function fn(
    items: Item[],
    active = false,
    curIndex = 0,
    delta = 0,
    originalIndex: number,
    axis: 'x' | 'y',
    itemSize: number,
    padding?: number,
): (index: number, item: Item) => { y?: number, x?: number, zIndex: number, immediate: false | ((key: any) => boolean) } {
    if (axis === 'x') {
        return (index, item) => ({
            x: (active && item.item === originalIndex)
                ? Math.min(
                    Math.max(curIndex * (itemSize + padding!) + delta, 0),
                    (items.length - 1) * (itemSize + padding!)
                )
                : items.indexOf(item) * (itemSize + padding!),
            zIndex: (active && item.item === originalIndex) ? 1 : 0,
            immediate: (active && item.item === originalIndex)
                ? (key) => key === 'x' || key === 'zIndex'
                : false
        })
    } else {
        return (index, item) => {
            if (active && item.item === originalIndex) {
                return {
                    y: Math.min(
                        Math.max(curIndex * (itemSize + padding!) + delta, 0),
                        (items.length - 1) * (itemSize + padding!)
                    ),
                    zIndex: 1,
                    immediate: (key) => key === 'y' || key === 'zIndex'
                }
            } else {
                return {
                    y: items.indexOf(item.item) * (itemSize + padding!),
                    zIndex: 0,
                    immediate: false
                }
            }
        }
    }
}

const useSpringDrag: UseItemsDrag = ({ items, updateOrder, api, style }) => {
    return useDrag(({ args: [originalIndex], active, movement: [x, y] }) => {
        if (!document.activeElement!.getAttribute('draggable-item')) {
            return
        }

        const curIndex = items.indexOf(originalIndex)

        if (style.axis === 'x') {
            const curCol = clamp(Math.round((curIndex * style.size + x) / style.size), 0, items.length - 1)
            const newCategories = move<Item>(items, curIndex, curCol)
            api.start(fn(
                newCategories,
                active,
                originalIndex,
                curIndex,
                x,
                style.axis,
                style.size,
                style.padding
            ))
            if (!active) updateOrder(newCategories)
        } else {
            const curRow = clamp(Math.round((curIndex * style.size + y) / style.size), 0, items.length - 1)
            const newCategories = move<Item>(items, curIndex, curRow)
            api.start(fn(
                newCategories,
                active,
                curIndex,
                y,
                originalIndex,
                style.axis,
                style.size,
                style.padding
            ))
            if (!active) updateOrder(newCategories)
        }
    })
}

export { useSpringDrag }
