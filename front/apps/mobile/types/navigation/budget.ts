import { StackScreenProps } from '@react-navigation/stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import type { BottomTabNavParamList, RootStackParamList } from './root';
import { Bill, Category, Transaction } from '@ledget/shared-features';

export type BudgetStackParamList = {
  Main: {
    day: number
  }
  Category: {
    category: Category
  }
  Bill: {
    bill: Bill
  }
  Transaction: {
    transaction: Transaction
  },
  EditCategories: undefined
  EditBills: undefined
};

export type BudgetScreenProps<T extends keyof BudgetStackParamList> =
  CompositeScreenProps<
    StackScreenProps<BudgetStackParamList, T>,
    CompositeScreenProps<BottomTabScreenProps<BottomTabNavParamList>, StackScreenProps<RootStackParamList>>
  >;
