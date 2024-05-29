import React, { useEffect, useRef } from 'react'

import { DropdownDiv } from '@ledget/ui'
import { useClickClose } from '../../utils/hooks'
import './abs-pos-menu.scss'

export const AbsPosMenu = ({ pos, show, setShow, topArrow = true, children }:
  {
    pos: { x: number, y: number } | undefined,
    show: boolean,
    setShow: (show: boolean) => void,
    topArrow?: boolean,
    children: React.ReactNode
  }) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useClickClose({
    refs: [menuRef],
    visible: show,
    setVisible: setShow,
  })

  useEffect(() => {
    if (!menuRef.current && pos) { setShow(true) }

    const handleKeyDown = (e: any) => {
      if (e.key === 'Escape' || e.key === 'Tab') {
        setShow(false)
      }
    }

    const handleWindowResize = () => { setShow(false) }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [pos])

  return (
    <div
      style={{
        position: 'absolute',
        top: pos ? pos.y + 40 : 0,
        left: pos ? pos.x : 0,
      }}
    >
      <DropdownDiv
        placement={'right'}
        visible={show}
        className={`options-dropdown ${topArrow ? 'arrow-right' : ''}`}
        style={{ zIndex: 10 }}
        ref={menuRef}
      >
        {children}
      </DropdownDiv>
    </div>
  )
}

export default AbsPosMenu
