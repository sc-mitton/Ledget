import { useEffect } from 'react'

function useClickClose({ refs, visible, setVisible }) {
    useEffect(() => {
        const handleClick = (event) => {
            event.stopPropagation()
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

        window.addEventListener('mousedown', handleClick)
        return () => {
            window.removeEventListener('mousedown', handleClick)
        }
    }, [refs, visible, setVisible])
}

export default useClickClose
