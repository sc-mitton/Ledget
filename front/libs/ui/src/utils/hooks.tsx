import { useEffect, useState, useRef } from 'react'

export const useLoaded = (time?: number, flag: boolean = true) => {
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        if (time && flag) {
            const timeout = setTimeout(() => {
                setLoaded(true)
            }, time)

            return () => clearTimeout(timeout)
        } else if (!time) {
            setLoaded(true)
        }
    }, [time, flag])

    return loaded
}

export const useIsMount = () => {
    const isMountRef = useRef(true);
    useEffect(() => {
        isMountRef.current = false;
    }, []);
    return isMountRef.current;
};

interface Props {
    refs: React.RefObject<HTMLElement | undefined>[]
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

interface I {
    refs: React.RefObject<HTMLElement>[],
    visible: boolean,
    setVisible: (b: boolean) => void,
    controllerId?: string[] | string
}

export function useCloseDropdown({ refs, visible, controllerId, setVisible }: I) {
    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            event.stopPropagation()
            let shouldClose = true
            for (const ref of refs) {
                if ((event.target as any)?.ariaHasPopup) {
                    shouldClose = false
                    break
                }
                if (ref.current === null) {
                    shouldClose = false
                    break
                }
                if (ref.current && ref.current.contains(event.target as Node)) {
                    shouldClose = false
                    break
                }
            }
            if (controllerId) {
                const ariaControls = (event.target as any).closest('button')?.getAttribute('aria-controls')
                if (Array.isArray(controllerId) && controllerId.some(id => id === ariaControls)) {
                    shouldClose = false
                } else if (controllerId === ariaControls) {
                    shouldClose = false
                }
            }
            shouldClose && setVisible(false)
        }

        const handleEscape = (event: KeyboardEvent) => {
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
