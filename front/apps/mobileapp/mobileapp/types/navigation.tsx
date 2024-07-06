import type { StackScreenProps } from '@react-navigation/stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import type { CompositeScreenProps } from '@react-navigation/native';

export type LoginStackParamList = {
  Email: undefined;
  Aal1: {
    identifier: string;
  };
  Aal2Authenticator: {
    identifier: string;
  };
  Aal2RecoveryCode: {
    identifier: string;
  };
};

export type RootAccountStackParamList = {
  Login: NavigatorScreenParams<LoginStackParamList>;
  Recovery: {
    identifier: string;
  };
  Verification: undefined;
};

export type EmailScreenProps = CompositeScreenProps<StackScreenProps<LoginStackParamList, 'Email'>, StackScreenProps<RootAccountStackParamList>>
export type Aal1AuthenticatorScreenProps = CompositeScreenProps<StackScreenProps<LoginStackParamList, 'Aal1'>, StackScreenProps<RootAccountStackParamList>>
export type Aal2AuthenticatorScreenProps = CompositeScreenProps<StackScreenProps<LoginStackParamList, 'Aal2Authenticator'>, StackScreenProps<RootAccountStackParamList>>
export type Aal2RecoveryCodeScreenProps = CompositeScreenProps<StackScreenProps<LoginStackParamList, 'Aal2RecoveryCode'>, StackScreenProps<RootAccountStackParamList>>

export type RecoveryScreenProps = StackScreenProps<RootAccountStackParamList, 'Recovery'>
