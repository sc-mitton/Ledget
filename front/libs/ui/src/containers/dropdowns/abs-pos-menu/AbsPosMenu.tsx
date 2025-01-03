import React, { useEffect, useRef } from 'react';

import { DropdownDiv } from '@ledget/ui';
import { useCloseDropdown } from '../../../utils/hooks';
import styles from './abs-pos-menu.module.scss';

export const AbsPosMenu = ({
  pos,
  show,
  setShow,
  topArrow = true,
  id,
  children,
}: {
  pos: { x: number; y: number } | undefined;
  show: boolean;
  setShow: (show: boolean) => void;
  topArrow?: boolean;
  children: React.ReactNode;
  id?: string;
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const cachedPos = useRef<{ x: number; y: number } | undefined>(undefined);

  useCloseDropdown({
    refs: [menuRef],
    visible: show,
    setVisible: setShow,
    controllerId: id ? id : [],
  });

  useEffect(() => {
    if (!cachedPos.current) {
      cachedPos.current = pos;
    } else if (
      pos?.x === cachedPos.current.x &&
      pos.y === cachedPos.current.y
    ) {
      setShow(false);
      cachedPos.current = undefined;
    }
  }, [pos]);

  useEffect(() => {
    if (!menuRef.current && pos) {
      setShow(true);
    }

    const handleKeyDown = (e: any) => {
      if (e.key === 'Escape' || e.key === 'Tab') {
        setShow(false);
      }
    };

    const handleWindowResize = () => {
      setShow(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pos]);

  return (
    <div
      style={{
        position: 'absolute',
        top: pos ? pos.y + 32 : 0,
        left: pos ? pos.x + 13 : 0,
      }}
      id={id}
    >
      <DropdownDiv
        placement={'right'}
        visible={show}
        className={[
          styles.optionsDropdown,
          topArrow ? styles.topArrow : '',
        ].join(' ')}
        style={{ zIndex: 10 }}
        ref={menuRef}
      >
        {children}
      </DropdownDiv>
    </div>
  );
};

export default AbsPosMenu;
