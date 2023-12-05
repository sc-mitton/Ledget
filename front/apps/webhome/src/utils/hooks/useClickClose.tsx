import { useEffect } from 'react'

interface Props {
    refs: React.RefObject<HTMLElement>[]
    visible: boolean
    setVisible: (visible: boolean) => void
}

export const useClickClose = ({ refs, visible, setVisible }: Props) => {
    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            event.stopPropagation()
            let flag = false
            for (const ref of refs) {
                if (ref.current && !ref.current.contains(event.target as Node)) {
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
