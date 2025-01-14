import type { MenuItemProps } from '@headlessui/react';

export interface TContext {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ItemProps extends MenuItemProps<'div'> {
  onClick: () => void;
  icon?: React.ReactNode;
  label: string;
}
