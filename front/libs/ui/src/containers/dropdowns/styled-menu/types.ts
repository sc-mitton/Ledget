import type { MenuItemProps } from '@headlessui/react';

export interface TContext {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ItemPropsBase extends MenuItemProps<'div'> {
  onClick: () => void;
}

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
