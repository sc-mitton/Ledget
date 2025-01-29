import type { MenuItemProps, MenuProps } from '@headlessui/react';
import { ElementType } from 'react';

export interface TContext {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ItemPropsBase extends MenuItemProps<'div'> {
  onClick: () => void;
}

export type StyledMenuProps<T extends ElementType> = {
  open?: boolean;
  children: React.ReactNode;
} & MenuProps<T>;

export type ItemProps = ItemPropsBase &
  (
    | {
        label: string;
        icon?: React.ReactNode;
        renderLeft?: never;
        renderRight?: never;
      }
    | {
        label?: never;
        icon?: never;
        renderLeft: () => JSX.Element;
        renderRight: () => JSX.Element;
      }
  );
