import { StackScreenProps } from '@react-navigation/stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import type { BottomTabNavParamList, RootStackParamList } from './root';

export type AccountsStackParamList = {
  Main: undefined,
  Transaction: {
    id: string
  }
};

export type AccountsScreenProps<T extends keyof AccountsStackParamList> =
  CompositeScreenProps<
    StackScreenProps<AccountsStackParamList, T>,
    CompositeScreenProps<BottomTabScreenProps<BottomTabNavParamList>, StackScreenProps<RootStackParamList>>
  >;
