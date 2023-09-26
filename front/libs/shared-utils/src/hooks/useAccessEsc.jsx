import { useEffect } from 'react'

function useAccessEsc({ refs, visible, setVisible }) {
    useEffect(() => {
        const handleClick = (event) => {
            event.stopPropagation()
            let shouldClose = false
            for (const ref of refs) {
                if (ref.current && !ref.current.contains(event.target)) {
                    shouldClose = true
                }
            }
            if (shouldClose) {
                setVisible(false)
            }
        }

        const handleEscape = (event) => {
            event.stopPropagation()
            if (event.key === 'Escape') {
                setVisible(false)
            }
        }

        window.addEventListener('keydown', handleEscape)
        window.addEventListener('mousedown', handleClick)
        return () => {
            window.removeEventListener('mousedown', handleClick)
            window.removeEventListener('keydown', handleEscape)
        }
    }, [refs, visible, setVisible])
}

export default useAccessEsc
