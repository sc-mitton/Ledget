import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import type { ProfileStackParamList } from './profile';
import type { LoginStackParamList } from './login';
import type { ModalStackParamList } from './modals';
import { Transaction } from '@ledget/shared-features';

export type BottomTabNavParamList = {
  Home: undefined;
  Budget: undefined;
  Accounts: undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackParamList = {
  BottomTabs: NavigatorScreenParams<BottomTabNavParamList>;
  Modals: NavigatorScreenParams<ModalStackParamList>;
  TransactionDetails: {
    transaction: Transaction;
  };
  SplitTransaction: {
    transaction: Transaction;
  };
  NewBill: {
    transaction: Transaction;
    period: 'monthly' | 'yearly';
  };
  NewCategory: {
    period: 'monthly' | 'yearly';
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
