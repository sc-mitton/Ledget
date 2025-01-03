import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import type { CompositeScreenProps } from '@react-navigation/native';

import type { ProfileStackParamList } from './profile';
import { AccountsStackParamList } from './accounts';
import { BudgetStackParamList } from './budget';
import { HomeStackParamList } from './home';
import { RootStackParamList } from './root';
import { ModalStackParamList } from './modals';

export type BottomTabNavParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Budget: NavigatorScreenParams<BudgetStackParamList>;
  Accounts: NavigatorScreenParams<AccountsStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

export type BottomTabScreenProps<T extends keyof BottomTabNavParamList> =
  CompositeScreenProps<
    StackScreenProps<BottomTabNavParamList, T>,
    CompositeScreenProps<
      StackScreenProps<RootStackParamList>,
      StackScreenProps<ModalStackParamList>
    >
  >;
