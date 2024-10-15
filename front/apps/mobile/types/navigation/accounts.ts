import { StackScreenProps } from '@react-navigation/stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import type { BottomTabNavParamList } from './bottomNav';
import type { RootStackParamList } from './root';
import { Account } from '@ledget/shared-features';


type AccountScreenBase = {
  options?: {
    title: React.ReactNode
  }
}

export type AccountsTabsParamList = {
  Depository: AccountScreenBase,
  Credit: AccountScreenBase,
  Investment: AccountScreenBase,
  Loan: AccountScreenBase
};

export type AccountsStackParamList = {
  AccountsTabs: NavigatorScreenParams<AccountsTabsParamList>,
};

export type AccountsScreenProps<T extends keyof AccountsStackParamList> =
  CompositeScreenProps<
    StackScreenProps<AccountsStackParamList, T>,
    CompositeScreenProps<BottomTabScreenProps<BottomTabNavParamList>, StackScreenProps<RootStackParamList>>
  >;


export type AccountsTabsScreenProps<T extends keyof AccountsTabsParamList> =
  CompositeScreenProps<
    StackScreenProps<AccountsTabsParamList, T>,
    CompositeScreenProps<StackScreenProps<AccountsStackParamList>, StackScreenProps<RootStackParamList>>
  >;

