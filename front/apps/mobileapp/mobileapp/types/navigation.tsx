import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootAccountStackParamList = {
  Email: undefined;
  Aal1Authentication: {
    identifier: string;
  };
  Aal2Authentication: {
    identifier: string;
  };
};

export type EmailProps = NativeStackScreenProps<RootAccountStackParamList, 'Email', 'Accounts'>;
export type Aal1AuthenticationProps = NativeStackScreenProps<RootAccountStackParamList, 'Aal1Authentication', 'Accounts'>;
export type Aal2AuthenticationProps = NativeStackScreenProps<RootAccountStackParamList, 'Aal2Authentication', 'Accounts'>;
