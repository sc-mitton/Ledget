// Make a context for the options and selected bills

import React, { createContext, useContext, useState } from 'react';
import { NewBill } from '@ledget/shared-features';

interface AddBillsContextType {
  listItems: (NewBill & { id: string })[];
  selectedItems: string[];
  setListItems: React.Dispatch<
    React.SetStateAction<(NewBill & { id: string })[]>
  >;
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
}

const AddBillsContext = createContext<AddBillsContextType | undefined>(
  undefined
);

export const useAddBillsContext = () => {
  const context = useContext(AddBillsContext);
  if (!context) {
    throw new Error(
      'useAddBillsContext must be used within an AddBillsProvider'
    );
  }
  return context;
};

export const AddBillsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [listItems, setListItems] = useState<(NewBill & { id: string })[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  return (
    <AddBillsContext.Provider
      value={{ listItems, selectedItems, setListItems, setSelectedItems }}
    >
      {children}
    </AddBillsContext.Provider>
  );
};

export default AddBillsProvider;
