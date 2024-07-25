import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import type { ProfileStackParamList } from './profile';
import type { LoginStackParamList } from './login';

export type RootTabParamList = {
  Home: undefined;
  Budget: undefined;
  Accounts: undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
  Activity: undefined;
};

export type RootAccountStackParamList = {
  Login: NavigatorScreenParams<LoginStackParamList>;
  Recovery: {
    identifier: string;
  };
  Verification: {
    identifier: string;
  };
};

export type RecoveryScreenProps = StackScreenProps<RootAccountStackParamList, 'Recovery'>
export type VerificationScreenProps = StackScreenProps<RootAccountStackParamList, 'Verification'>
