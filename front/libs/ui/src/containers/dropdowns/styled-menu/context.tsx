import { Menu } from '@headlessui/react';
import { createContext, useContext as useC, useEffect, useState } from 'react';
import type { TContext } from './types';

const Context = createContext<TContext | null>(null);

export const Provider = (props: {
  children: React.ReactNode;
  open: boolean;
}) => {
  const [open, setOpen] = useState(props.open);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  return (
    <Context.Provider value={{ open, setOpen }}>
      {props.children}
    </Context.Provider>
  );
};

export const useContext = (): TContext => {
  const context = useC(Context);
  if (!context) {
    throw new Error('useContext must be used within an StyledMenu');
  }
  return context;
};
