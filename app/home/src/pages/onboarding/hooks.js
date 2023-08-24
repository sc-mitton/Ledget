import { useDrag } from 'react-use-gesture'
import clamp from 'lodash.clamp'
import swap from 'lodash-move'
import { itemHeight, itemPadding } from './constants'

const fn = (items, active = false, originalIndex, curIndex = 0, y = 0) => (index, item) =>
    active && item.item === originalIndex
        ? {
            y: Math.min(
                Math.max(curIndex * (itemHeight + itemPadding) + y, 0),
                (items.length - 1) * (itemHeight + itemPadding)
            ),
            zIndex: 1,
            immediate: (key) => key === 'y' || key === 'zIndex',
        }
        : {
            y: items.indexOf(item.item) * (itemHeight + itemPadding),
            zIndex: 0,
            immediate: false,
        }

export const useItemsDrag = (items, setItems, api) => {
    const bind = useDrag(({ args: [originalIndex], active, movement: [, y] }) => {
        if (!document.activeElement.getAttribute('draggable-item')) {
            return
        }

        const curIndex = items.indexOf(originalIndex)
        const curRow = clamp(Math.round((curIndex * itemHeight + y) / itemHeight), 0, items.length - 1)
        const newCategories = swap(items, curIndex, curRow)
        api.start(fn(newCategories, active, originalIndex, curIndex, y))
        if (!active) setItems(newCategories)
    })

    return bind
}
