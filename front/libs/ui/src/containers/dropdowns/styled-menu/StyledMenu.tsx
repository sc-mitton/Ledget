import { useEffect, useRef, useState, forwardRef, ElementType } from 'react';
import { Menu as HeadlessMenu } from '@headlessui/react';

import styles from './styled-menu.module.scss';
import { DropdownDiv } from '../../../animations/dropdowndiv/dropdowndiv';
import { useContext, Provider } from './context';
import { ItemProps, StyledMenuProps } from './types';

const StyledMenu = <T extends ElementType = 'div'>({
  children,
  open: propsOpen,
  as = 'div' as T,
  className,
  ...rest
}: StyledMenuProps<T>) => {
  const [side, setSide] = useState<'left' | 'right'>();
  const measure = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const side =
        (measure.current?.getBoundingClientRect().left || 0) <
        window.innerWidth / 2
          ? 'left'
          : 'right';
      setSide(side);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <HeadlessMenu
      data-side={side}
      ref={measure}
      as={as as ElementType}
      className={[className, styles.menu].join(' ')}
      {...rest}
    >
      {({ open }) => <Provider open={propsOpen || open}>{children}</Provider>}
    </HeadlessMenu>
  );
};

const Items = forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    className?: string;
    onOpen?: (open: boolean) => void;
  }
>(({ children, className, onOpen }, ref) => {
  const { open } = useContext();

  useEffect(() => {
    onOpen && onOpen(open);
  }, [open]);

  return (
    <HeadlessMenu.Items
      static
      className={[className, styles.itemsContainer].join(' ')}
    >
      <DropdownDiv
        visible={open}
        placement="auto"
        className={[styles.dropdown, className].join(' ')}
      >
        <div className={styles.items} ref={ref}>
          {children}
        </div>
      </DropdownDiv>
    </HeadlessMenu.Items>
  );
});

const Item = ({
  onClick,
  label,
  icon,
  className,
  renderLeft,
  renderRight,
  destructive,
  ...rest
}: ItemProps) => {
  return (
    <HeadlessMenu.Item
      {...rest}
      data-destructive={destructive}
      className={[className, styles.itemContainer].join(' ')}
    >
      {({ active }) => (
        <div className={styles.itemContainer}>
          <button
            onClick={onClick}
            className={styles.item}
            data-active={active}
          >
            {renderLeft ? renderLeft() : <span>{label}</span>}
            {renderRight ? (
              renderRight()
            ) : (
              <div className={styles.itemIcon}>{icon}</div>
            )}
          </button>
        </div>
      )}
    </HeadlessMenu.Item>
  );
};

StyledMenu.Button = HeadlessMenu.Button;
StyledMenu.Items = Items;
StyledMenu.Item = Item;

export default StyledMenu;
