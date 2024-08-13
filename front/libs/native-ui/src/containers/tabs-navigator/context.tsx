import { createContext, useContext } from 'react';

import type { TContext } from './types';

const TabsNavigatorContext = createContext<TContext | undefined>(undefined);

export const useTabsNavigatorContext = () => {
  const context = useContext(TabsNavigatorContext);
  if (!context) {
    throw new Error('useTabsNavigatorContext must be used within a TabsNavigatorContext')
  }
  return context;
}

export default TabsNavigatorContext;
