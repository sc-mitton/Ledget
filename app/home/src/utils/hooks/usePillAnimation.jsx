
import { useEffect, useState } from 'react'
import { useSpring } from '@react-spring/web'

const usePillAnimation = (args) => {
    const { ref, update, role, styles } = args
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

    // Add or update base styles
    if (styles) {
        baseStyles = {
            ...baseStyles,
            ...styles
        }
    }

    const api = useSpring({
        width: selector?.offsetWidth || 0,
        left: selector?.offsetLeft,
        ...baseStyles
    })

    useEffect(() => {
        if (selectors.length > 0) {
            const element = selectors.find(
                (element) => element.firstChild.name === location.pathname.split("/")[1]
            )
            setSelector(element)
        }
    }, [selectors, location.pathname])

    useEffect(() => {
        setTimeout(() => {
            const elements = Array.from(
                ref.current.querySelectorAll(`[role=${role}]`)
            )
            setSelectors(elements)
        }, 0)
    }, [...update])

    return api
}

export default usePillAnimation
