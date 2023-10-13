import { useRef, useState, useEffect } from 'react'

import './styles/ShadowedContainer.css'

const ShadowedContainer = (props) => {
    const { showShadow = true, children, onScroll, ...rest } = props

    const ref = useRef(null)
    const [bottomShadow, setBottomShadow] = useState(false)
    const [topShadow, setTopShadow] = useState(false)

    const handleScroll = (e) => {
        onScroll && onScroll(e)
        setBottomShadow((e.target.scrollTopMax - e.target.scrollTop) !== 0)
        setTopShadow(e.target.scrollTop !== 0)
    }

    // Effects for listening to resize and scroll events to set
    // the shadows correctly
    useEffect(() => {
        ref.current?.firstChild.addEventListener('scroll', handleScroll)

        const observer = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.target.style.overflowY === 'hidden') {
                    setBottomShadow(false)
                    setTopShadow(false)
                } else {
                    setBottomShadow(entry.target.clientHeight < entry.target.scrollHeight)
                }
            })
        })
        ref.current?.firstChild && observer.observe(ref.current?.firstChild)

        return () => {
            ref.current?.firstChild.removeEventListener('scroll', handleScroll)
            observer.disconnect()
        }
    }, [showShadow])

    useEffect(() => {
        const setBottomShadowDelayed = () => {
            if (ref.current?.firstChild.scrollHeight !== ref.current?.firstChild.clientHeight) {
                setBottomShadow(true)
            } else if ((ref.current?.firstChild.scrollTopMax - ref.current?.firstChild.scrollTop) !== 0) {
                setBottomShadow(true)
            } else {
                setBottomShadow(false)
            }
        }
        let timeoutId = setTimeout(setBottomShadowDelayed, 0)
        return () => {
            clearTimeout(timeoutId)
        }
    }, [showShadow])

    return (
        <div className="scroll-shadows--container" ref={ref} {...rest}>
            {children}
            {showShadow && bottomShadow && <div className="bottom-shadow" />}
            {showShadow && topShadow && <div className="top-shadow" />}
        </div>
    )
}

export default ShadowedContainer
