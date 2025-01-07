import React, {
  createContext,
  useContext as useC,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';

// Define the type for the context value
interface ItemFocusContextType {
  itemWithFocus: string;
  setItemWithFocus: Dispatch<SetStateAction<string>>;
}

// Create the context
const Context = createContext<ItemFocusContextType | undefined>(undefined);

// Create the provider component
const Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [itemWithFocus, setItemWithFocus] = useState<string>('');

  return (
    <Context.Provider value={{ itemWithFocus, setItemWithFocus }}>
      {children}
    </Context.Provider>
  );
};

// Create a custom hook to use the context
export const useContext = (): ItemFocusContextType => {
  const context = useC(Context);
  if (!context) {
    throw new Error('useItemFocus must be used within an ItemFocusProvider');
  }
  return context;
};

export default Provider;
