import { useEffect, useRef, useState } from 'react';
import { Menu as HeadlessMenu } from '@headlessui/react';

import styles from './styled-menu.module.scss';
import { DropdownDiv } from '../../../animations/dropdowndiv/dropdowndiv';
import { useContext, Provider } from './context';
import { ItemProps } from './types';

const StyledMenu = ({ children }: { children: React.ReactNode }) => {
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
      as="div"
      className={styles.menu}
      data-side={side}
      ref={measure}
    >
      {({ open }) => <Provider open={open}>{children}</Provider>}
    </HeadlessMenu>
  );
};

const Items = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { open } = useContext();

  return (
    <HeadlessMenu.Items static>
      <DropdownDiv visible={open} placement="auto" className={styles.dropdown}>
        <div className={styles.dropdownInner}>{children}</div>
      </DropdownDiv>
    </HeadlessMenu.Items>
  );
};

const Item = ({
  onClick,
  label,
  icon,
  className,
  renderLeft,
  renderRight,
  ...rest
}: ItemProps) => {
  return (
    <HeadlessMenu.Item
      {...rest}
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
            {renderRight ? renderRight() : <div>{icon}</div>}
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
