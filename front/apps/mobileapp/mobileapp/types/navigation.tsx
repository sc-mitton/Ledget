import type { StackScreenProps } from '@react-navigation/stack';

export type RootAccountStackParamList = {
  Email: undefined;
  Aal1Authentication: {
    identifier: string;
  };
  Aal2Authentication: {
    identifier: string;
  };
};


export type EmailProps = StackScreenProps<RootAccountStackParamList, 'Email', 'Accounts'>;
export type Aal1AuthenticationProps = StackScreenProps<RootAccountStackParamList, 'Aal1Authentication', 'Accounts'>;
export type Aal2AuthenticationProps = StackScreenProps<RootAccountStackParamList, 'Aal2Authentication', 'Accounts'>;
