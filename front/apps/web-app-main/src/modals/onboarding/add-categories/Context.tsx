import _ from 'lodash';

import React, { createContext, useContext, useState } from 'react';
import { NewCategory } from '@ledget/shared-features';
import {
  monthRecommendations,
  yearRecommendations,
} from './categoryRecommendations';

interface AddCategoriesContextType {
  listItems: NewCategory[];
  selectedItems: string[];
  setListItems: React.Dispatch<React.SetStateAction<NewCategory[]>>;
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
}

const AddCategoriesContext = createContext<
  AddCategoriesContextType | undefined
>(undefined);

export const useAddCategoriesContext = () => {
  const context = useContext(AddCategoriesContext);
  if (!context) {
    throw new Error(
      'useAddCategoriesContext must be used within an AddBillsProvider'
    );
  }
  return context;
};

export const AddBillsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [listItems, setListItems] = useState<NewCategory[]>(
    _.shuffle(monthRecommendations.concat(yearRecommendations)).map(
      (category) => ({
        ...category,
        limit_amount: 0,
        id: `suggested-${Math.random().toString(36).substring(2, 15)}`,
      })
    )
  );
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  return (
    <AddCategoriesContext.Provider
      value={{ listItems, selectedItems, setListItems, setSelectedItems }}
    >
      {children}
    </AddCategoriesContext.Provider>
  );
};

export default AddBillsProvider;
