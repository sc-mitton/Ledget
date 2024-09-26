import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import type { CompositeScreenProps } from '@react-navigation/native';

import type { ProfileStackParamList } from './profile';
import type { LoginStackParamList } from './login';
import type { ModalStackParamList } from './modals';
import { Transaction } from '@ledget/shared-features';
import { AccountsStackParamList } from './accounts';
import { BudgetStackParamList } from './budget';

export type BottomTabNavParamList = {
  Home: undefined;
  Budget: NavigatorScreenParams<BudgetStackParamList>;
  Accounts: NavigatorScreenParams<AccountsStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackParamList = {
  BottomTabs: NavigatorScreenParams<BottomTabNavParamList>;
  Modals: NavigatorScreenParams<ModalStackParamList>;
  TransactionDetails: {
    transaction: Transaction;
  }
}

export type RootAuthenticationStackParamList = {
  Login: NavigatorScreenParams<LoginStackParamList>;
  Recovery: {
    identifier: string;
  };
  Verification: {
    identifier: string;
  };
};

export type RecoveryScreenProps = StackScreenProps<RootAuthenticationStackParamList, 'Recovery'>
export type VerificationScreenProps = StackScreenProps<RootAuthenticationStackParamList, 'Verification'>
export type BottomTabScreenProps<T extends keyof BottomTabNavParamList> = CompositeScreenProps<
  StackScreenProps<BottomTabNavParamList, T>,
  CompositeScreenProps<
    StackScreenProps<RootStackParamList>,
    StackScreenProps<ModalStackParamList>
  >
>;
