import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import type { BottomTabNavParamList, RootStackParamList } from './root';

export type BudgetStackParamList = {
  Main: {
    day: number
  }
  Category: {
    id: string
  }
};

export type BudgetScreenProps<T extends keyof BudgetStackParamList> =
  CompositeScreenProps<
    StackScreenProps<BudgetStackParamList, T>,
    CompositeScreenProps<BottomTabScreenProps<BottomTabNavParamList>, StackScreenProps<RootStackParamList>>
  >;
