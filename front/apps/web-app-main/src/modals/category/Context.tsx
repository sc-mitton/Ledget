import { Category as CategoryT } from '@ledget/shared-features';
import { createContext, useContext, useState } from 'react';

interface ContextT {
  view: 'detail' | 'edit' | 'delete';
  setView: React.Dispatch<React.SetStateAction<'detail' | 'edit' | 'delete'>>;
  category: CategoryT;
}

const Context = createContext<ContextT | null>(null);

export const useCategoryModalContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('You must exist within the context');
  }
  return context;
};

const CategoryContextProvider = ({
  children,
  category,
}: {
  children: React.ReactNode;
  category: CategoryT;
}) => {
  const [view, setView] = useState<ContextT['view']>('detail');

  return (
    <Context.Provider value={{ view, category, setView }}>
      {children}
    </Context.Provider>
  );
};

export default CategoryContextProvider;
