import { useEffect } from 'react'

function useAccessEsc({ refs, visible, setVisible }) {
    useEffect(() => {
        const handleClick = (event) => {
            let flag = false
            for (const ref of refs) {
                if (ref.current && !ref.current.contains(event.target)) {
                    continue
                } else {
                    flag = true
                    break
                }
            }
            if (!flag) {
                setVisible(false)
            }
        }

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                event.stopPropagation()
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
