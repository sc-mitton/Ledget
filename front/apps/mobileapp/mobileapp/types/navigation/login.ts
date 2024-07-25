import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootAccountStackParamList } from './root';

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

// Login
export type EmailScreenProps = CompositeScreenProps<StackScreenProps<LoginStackParamList, 'Email'>, StackScreenProps<RootAccountStackParamList>>
export type Aal1AuthenticatorScreenProps = CompositeScreenProps<StackScreenProps<LoginStackParamList, 'Aal1'>, StackScreenProps<RootAccountStackParamList>>
export type Aal2AuthenticatorScreenProps = CompositeScreenProps<StackScreenProps<LoginStackParamList, 'Aal2Authenticator'>, StackScreenProps<RootAccountStackParamList>>
export type Aal2RecoveryCodeScreenProps = CompositeScreenProps<StackScreenProps<LoginStackParamList, 'Aal2RecoveryCode'>, StackScreenProps<RootAccountStackParamList>>
