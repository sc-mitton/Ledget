import type { StackScreenProps } from '@react-navigation/stack';

export type RootAccountStackParamList = {
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


export type EmailProps = StackScreenProps<RootAccountStackParamList, 'Email', 'Accounts'>;
export type Aal1AuthenticationProps = StackScreenProps<RootAccountStackParamList, 'Aal1', 'Accounts'>;
export type Aal2AuthenticationProps = StackScreenProps<RootAccountStackParamList, 'Aal2Authenticator', 'Accounts'>;
export type Aal2RecoveryCodeProps = StackScreenProps<RootAccountStackParamList, 'Aal2RecoveryCode', 'Accounts'>;
