import { useEffect, useState } from 'react'
import { useSpring } from '@react-spring/web'

interface Props {
    ref: React.RefObject<HTMLElement>
    find: (element: HTMLElement) => boolean
    querySelectall: string
    update: any[]
    refresh?: any[]
    styles?: any
}

/**
 * Custom hook for animating a pill element behind selected options.
 *
 * @param {Object} args - The configuration object containing the arguments.
 * @param {React.RefObject} args.ref - The React ref pointing to the container holding the options.
 * @param {Array} [args.update=[]] - An array of state variables that trigger element refresh for selection.
 * @param {Object} [args.styles] - An object with CSS styles to customize the appearance of the pill animation.
 * @param {Function} args.find - A callback function to filter and find the desired element from the list of selectors.
 * @param {string} args.querySelectAll - A string representing the CSS selector to query for the DOM elements to animate behind.
 * @returns {Object} An object containing the animated props from `useSpring`.
 */
const usePillAnimation = ({ ref, find, querySelectall, update = [], refresh = [], styles = {} }: Props): any => {
    const [selectors, setSelectors] = useState<HTMLElement[]>([])

    const [selectorWidth, setSelectorWidth] = useState<number>()
    const [selectorHeight, setSelectorHeight] = useState<number>()
    const [selectorLeft, setSelectorLeft] = useState<number>()
    const [selectorTop, setSelectorTop] = useState<number>()

    let baseStyles = {
        position: "absolute",
        backgroundColor: "var(--btn-hover-gray)",
        borderRadius: 'var(--border-radius2)',
        zIndex: 0,
        config: { tension: 200, friction: 22 }
    }

    baseStyles = { ...baseStyles, ...styles }

    const props = useSpring({
        width: selectorWidth,
        left: selectorLeft,
        top: selectorTop,
        height: selectorHeight,
        ...baseStyles
    })

    useEffect(() => {
        if (selectors.length > 0) {
            const element = selectors.find(find)
            if (element) {
                setSelectorHeight(element.offsetHeight)
                setSelectorWidth(element.offsetWidth)
                setSelectorLeft(element.offsetLeft)
                setSelectorTop(element.offsetTop)
            }
        }
    }, [selectors, ...update])

    useEffect(() => {
        setTimeout(() => {
            const elements = Array.from(ref.current ? ref.current.querySelectorAll<HTMLElement>(querySelectall) : [])
            elements.length > 0 && setSelectors(elements)
        }, 50)
    }, [...refresh])

    return { props }
}

export default usePillAnimation
