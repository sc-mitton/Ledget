import { StackScreenProps } from '@react-navigation/stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import type { BottomTabNavParamList, RootStackParamList } from './root';
import { Account, AccountType } from '@ledget/shared-features';

export type AccountsStackParamList = {
  Main: {
    account?: Account
  } | undefined,
  Transaction: {
    id: string
  },
  PickAccount: {
    accountType: AccountType
  }
};

export type AccountsScreenProps<T extends keyof AccountsStackParamList> =
  CompositeScreenProps<
    StackScreenProps<AccountsStackParamList, T>,
    CompositeScreenProps<BottomTabScreenProps<BottomTabNavParamList>, StackScreenProps<RootStackParamList>>
  >;
