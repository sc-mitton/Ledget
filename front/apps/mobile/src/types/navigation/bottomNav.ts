import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import type { CompositeScreenProps } from '@react-navigation/native';

import { AccountsStackParamList } from './accounts';
import { BudgetStackParamList } from './budget';
import { HomeStackParamList } from './home';
import { RootStackParamList } from './root';
import { ModalStackParamList } from './modals';
import { ProfileStackParamList } from './profile';

export type BottomTabNavParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Budget: NavigatorScreenParams<BudgetStackParamList>;
  Accounts: NavigatorScreenParams<AccountsStackParamList>;
};

export type BottomTabScreenProps<T extends keyof BottomTabNavParamList> =
  CompositeScreenProps<
    StackScreenProps<BottomTabNavParamList, T>,
    CompositeScreenProps<
      StackScreenProps<RootStackParamList>,
      StackScreenProps<ModalStackParamList>
    >
  >;
