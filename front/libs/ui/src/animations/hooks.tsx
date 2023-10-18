import { useDrag } from '@use-gesture/react'
import clamp from 'lodash.clamp'

interface UseItemsDrag {
    (args: {
        order: React.MutableRefObject<number[]>
        indexCol?: string,
        api: any,
        onRest?: (newOrder: number[]) => void,
        style: {
            axis: 'x' | 'y'
            size: number,
            padding: number,
        }
    }): any
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

function fn(
    order: number[],
    indexCol: string,
    active = false,
    itemId = '',
    curIndex = 0,
    delta = 0,
    axis = 'y',
    itemSize = 0,
    padding = 0,
): (index: number, item: any) => { y?: number, x?: number, zIndex: number, immediate: false | ((key: any) => boolean) } {
    return (index: number, item: any) => {
        if (active && item._item[indexCol] === itemId) {
            const pos = Math.min(
                Math.max(curIndex * (itemSize + padding) + delta, 0),
                (order.length - 1) * (itemSize + padding)
            )
            const xImmediate = (key: any) => key === 'x' || key === 'zIndex'
            const yImmediate = (key: any) => key === 'y' || key === 'zIndex'
            return ({
                ...(axis === 'x' ? { x: pos } : { y: pos }),
                ...(axis === 'x' ? { immediate: xImmediate } : { immediate: yImmediate }),
                zIndex: 1,
                scale: 1.04
            })
        } else {
            const pos = order.indexOf(item._item[indexCol]) * (itemSize + padding)
            return ({
                ...(axis === 'x' ? { x: pos } : { y: pos }),
                zIndex: 0,
                immediate: false,
                scale: 1,
            })
        }
    }
}

const useSpringDrag: UseItemsDrag = ({ order, indexCol = 'id', api, style, onRest }) => {
    return useDrag(({ args: [itemId], active, movement: [x, y] }) => {
        if (!document.activeElement || !document.activeElement.getAttribute('draggable-item')) {
            return
        }
        const curIndex = order.current.indexOf(itemId)
        const curPosition = clamp(
            style.axis === 'x'
                ? Math.round((curIndex * style.size + x) / style.size)
                : Math.round((curIndex * style.size + y) / style.size),
            0,
            order.current.length - 1
        )
        const newOrder = swap<number>(order.current, curIndex, curPosition)
        api.start(fn(
            newOrder,
            indexCol,
            active,
            itemId,
            curIndex,
            style.axis === 'x' ? x : y,
            style.axis,
            style.size,
            style.padding
        ))
        if (!active) order.current = newOrder
        if (!active && onRest) { onRest(newOrder) }
    })
}

export { useSpringDrag }
