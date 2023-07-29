
import { useEffect, useState } from 'react'
import { useSpring } from '@react-spring/web'

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
const usePillAnimation = (args) => {
    const { ref, update, refresh, styles, find, querySelectall } = args
    const [selectors, setSelectors] = useState([])
    const [selector, setSelector] = useState()

    let baseStyles = {
        position: "absolute",
        backgroundColor: "var(--button-hover-gray)",
        borderRadius: '12px',
        height: "100%",
        top: 0,
        zIndex: -1,
        config: { tension: 200, friction: 22 }
    }

    baseStyles = { ...baseStyles, ...styles }

    const props = useSpring({
        width: selector?.offsetWidth,
        left: selector?.offsetLeft,
        ...baseStyles
    })

    useEffect(() => {
        if (selectors.length > 0) {
            const element = selectors.find(find)
            setSelector(element)
        }
    }, [selectors, ...update])

    useEffect(() => {
        setTimeout(() => {
            const elements = Array.from(
                ref.current.querySelectorAll(querySelectall)
            )
            setSelectors(elements)
        }, 0)
    }, [...refresh])

    return { props }
}

export default usePillAnimation
