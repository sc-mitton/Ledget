import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootAuthenticationStackParamList } from './root';

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

export type LoginScreenProps<T extends keyof LoginStackParamList> =
  CompositeScreenProps<
    StackScreenProps<LoginStackParamList, T>,
    StackScreenProps<RootAuthenticationStackParamList>
  >
