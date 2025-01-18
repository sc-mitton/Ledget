import type { MenuItemProps } from '@headlessui/react';

export interface TContext {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ItemPropsBase extends MenuItemProps<'div'> {
  onClick: () => void;
}

type XOR<T, U> =
  | (T & { [K in keyof U]?: never })
  | (U & { [K in keyof T]?: never });

type LeftProps = XOR<{ label: string }, { renderLeft: () => JSX.Element }>;
type RightProps = XOR<
  { icon: React.ReactNode },
  { renderRight: () => JSX.Element }
>;

export type ItemProps = ItemPropsBase & LeftProps & RightProps;
