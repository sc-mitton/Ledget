import { createContext, useContext, useState } from "react";

type ContextT = {
  categoriesIndex: number;
  setCategoriesIndex: (n: number) => void;
  billsIndex: number;
  setBillsIndex: (n: number) => void;
}

export const BudgetContext = createContext<ContextT | null>(null);

export const useBudgetContext = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudgetContext must be used within a BudgetContextProvider');
  }
  return context;
}

export default function (props: { children: React.ReactNode }) {
  const [categoriesIndex, setCategoriesIndex] = useState(0);
  const [billsIndex, setBillsIndex] = useState(0);

  return (
    <BudgetContext.Provider
      value={{
        categoriesIndex,
        setCategoriesIndex,
        billsIndex,
        setBillsIndex
      }}
    >
      {props.children}
    </BudgetContext.Provider>
  )
}
