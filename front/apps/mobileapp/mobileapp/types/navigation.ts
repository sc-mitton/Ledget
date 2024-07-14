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

export type ProfileStackParamList = {
  Account: undefined;
  Security: undefined;
  Connections: undefined;
};

export type RootAccountStackParamList = {
  Login: NavigatorScreenParams<LoginStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
  Recovery: {
    identifier: string;
  };
  Verification: {
    identifier: string;
  };
};

export type RootTabParamList = {
  Home: undefined;
  Budget: undefined;
  Accounts: undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
  Activity: undefined;
};

// Login
export type EmailScreenProps = CompositeScreenProps<StackScreenProps<LoginStackParamList, 'Email'>, StackScreenProps<RootAccountStackParamList>>
export type Aal1AuthenticatorScreenProps = CompositeScreenProps<StackScreenProps<LoginStackParamList, 'Aal1'>, StackScreenProps<RootAccountStackParamList>>
export type Aal2AuthenticatorScreenProps = CompositeScreenProps<StackScreenProps<LoginStackParamList, 'Aal2Authenticator'>, StackScreenProps<RootAccountStackParamList>>
export type Aal2RecoveryCodeScreenProps = CompositeScreenProps<StackScreenProps<LoginStackParamList, 'Aal2RecoveryCode'>, StackScreenProps<RootAccountStackParamList>>

export type RecoveryScreenProps = StackScreenProps<RootAccountStackParamList, 'Recovery'>
export type VerificationScreenProps = StackScreenProps<RootAccountStackParamList, 'Verification'>

// Profile
export type ProfileScreenProps = StackScreenProps<RootAccountStackParamList, 'Profile'>
export type AccountScreenProps = StackScreenProps<ProfileStackParamList, 'Account'>
export type SecurityScreenProps = StackScreenProps<ProfileStackParamList, 'Security'>
export type ConnectionsScreenProps = StackScreenProps<ProfileStackParamList, 'Connections'>
