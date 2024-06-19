import { useContext, createContext, useState, useEffect } from 'react';
import {
  TransitionFn,
  SpringRef,
  SpringValue,
  useSpringRef,
  useSpring,
  useTransition,
  useChain
} from '@react-spring/web';

import type { NewBill, NewCategory } from '@ledget/shared-features';

const itemHeight = 25;
const itemPadding = 8;

export type Period = 'month' | 'year';
export type ItemS = 'bill' | 'category';

type BillOrCatFromString<I extends ItemS> = I extends 'bill'
  ? NewBill
  : NewCategory;

export type Item<I extends NewBill | NewCategory, P> = I extends NewBill
  ? Omit<NewBill, 'period'> &
      (P extends 'month' ? { period: 'month' } : { period: 'year' })
  : Omit<NewCategory, 'period'> &
      (P extends 'month' ? { period: 'month' } : { period: 'year' }) & {
        id: string;
      };

export type BillItem<P extends Period> = Item<NewBill, P>;
export type CategoryItem<P extends Period> = Item<NewCategory, P>;

interface MonthYearContext<BC extends NewBill | NewCategory, P extends Period> {
  items: Item<BC, P>[];
  setItems: React.Dispatch<React.SetStateAction<Item<BC, P>[]>>;
  transitions: TransitionFn<Item<BC, P> | undefined, any>;
  api: SpringRef<any>;
  containerProps: { [key: string]: SpringValue<any> };
  containerApi: SpringRef<any>;
  isEmpty: boolean;
}

interface ItemsContextProps<BC extends NewBill | NewCategory> {
  itemsEmpty: boolean;
  recommendationsMode: boolean;
  setRecommendationsMode: React.Dispatch<React.SetStateAction<boolean>>;
  month: MonthYearContext<BC, 'month'>;
  year: MonthYearContext<BC, 'year'>;
  periodTabIndex: number;
  setPeriodTabIndex: React.Dispatch<React.SetStateAction<number>>;
}

const BillsContext = createContext<ItemsContextProps<NewBill> | undefined>(
  undefined
);
const CategoriesContext = createContext<
  ItemsContextProps<NewCategory> | undefined
>(undefined);

export const useItemsContext = <T extends ItemS>(
  items: T
): T extends 'bill'
  ? ItemsContextProps<NewBill>
  : ItemsContextProps<NewCategory> => {
  const context =
    items === 'bill' ? useContext(BillsContext) : useContext(CategoriesContext);

  if (context === undefined) {
    throw new Error('useBillsContext must be used within a BillsProvider');
  }

  return context as any;
};

const transitionConfig = {
  from: () => ({ opacity: 0, zIndex: 0, scale: 1 }),
  enter: (item: any, index: number) => ({
    opacity: 1,
    y: index * (itemHeight + itemPadding)
  }),
  update: (item: any, index: number) => ({
    y: index * (itemHeight + itemPadding)
  }),
  leave: () => ({ opacity: 0 }),
  config: { duration: 100 }
};

export const ItemsProvider = ({
  children,
  itemType
}: {
  children: React.ReactNode;
  itemType: ItemS;
}) => {
  const [monthItems, setMonthItems] = useState<
    Item<BillOrCatFromString<typeof itemType>, 'month'>[]
  >([]);
  const [yearItems, setYearItems] = useState<
    Item<BillOrCatFromString<typeof itemType>, 'year'>[]
  >([]);
  const [itemsEmpty, setItemsEmpty] = useState(true);
  const [recommendationsMode, setRecommendationsMode] = useState(false);
  const [emptyYearItems, setEmptyYearItems] = useState(true);
  const [emptyMonthItems, setEmptyMonthItems] = useState(true);
  const [periodTabIndex, setPeriodTabIndex] = useState<number>(0);

  const monthApi = useSpringRef();
  const yearApi = useSpringRef();
  const monthContainerApi = useSpringRef();
  const yearContainerApi = useSpringRef();

  const monthTransitions = useTransition(monthItems, {
    ...transitionConfig,
    ref: monthApi
  });
  const yearTransitions = useTransition(yearItems, {
    ...transitionConfig,
    ref: yearApi
  });

  const monthContainerProps = useSpring({
    height: monthItems.length * (itemHeight + itemPadding),
    maxHeight: 6 * (itemHeight + itemPadding),
    ref: monthContainerApi,
    config: { duration: 100 },
    position: 'relative',
    width: '100%'
  });
  const yearContainerProps = useSpring({
    height: yearItems.length * (itemHeight + itemPadding),
    maxHeight: 6 * (itemHeight + itemPadding),
    ref: yearContainerApi,
    position: 'relative',
    width: '100%',
    config: { duration: 100 }
  });

  useChain([monthApi, monthContainerApi], [0, 0]);
  useChain([yearApi, yearContainerApi], [0, 0]);

  useEffect(() => {
    monthApi.start();
    monthContainerApi.start();
    if (monthItems.length > 0) setEmptyMonthItems(false);
  }, [monthItems]);

  useEffect(() => {
    yearApi.start();
    yearContainerApi.start();
    if (yearItems.length > 0) setEmptyYearItems(false);
  }, [yearItems]);

  useEffect(() => {
    if (monthItems.length > 0 || yearItems.length > 0) {
      setItemsEmpty(false);
    } else {
      setItemsEmpty(true);
    }
  }, [monthItems, yearItems]);

  const monthContext = {
    items: monthItems,
    setItems: setMonthItems,
    transitions: monthTransitions,
    api: monthApi,
    containerProps: monthContainerProps,
    containerApi: monthContainerApi,
    isEmpty: emptyMonthItems
  };

  const yearContext = {
    items: yearItems,
    setItems: setYearItems,
    transitions: yearTransitions,
    api: yearApi,
    containerProps: yearContainerProps,
    containerApi: yearContainerApi,
    isEmpty: emptyYearItems
  };

  const vals = {
    itemsEmpty,
    recommendationsMode: recommendationsMode,
    setRecommendationsMode: setRecommendationsMode,
    month: monthContext,
    year: yearContext,
    periodTabIndex,
    setPeriodTabIndex
  };

  return itemType === 'bill' ? (
    <BillsContext.Provider value={vals as ItemsContextProps<NewBill>}>
      {children}
    </BillsContext.Provider>
  ) : (
    <CategoriesContext.Provider value={vals as ItemsContextProps<NewCategory>}>
      {children}
    </CategoriesContext.Provider>
  );
};
