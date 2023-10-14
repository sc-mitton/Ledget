import React, { useEffect } from 'react';

interface I {
  refs: React.RefObject<HTMLElement>[],
  visible: boolean,
  setVisible: (b: boolean) => void
}

function useAccessEsc({ refs, visible, setVisible }: I) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      event.stopPropagation()
      let shouldClose = false
      for (const ref of refs) {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          shouldClose = true
        }
      }
      if (shouldClose) {
        setVisible(false)
      }
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

export default useAccessEsc
