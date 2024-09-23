import { StackScreenProps } from '@react-navigation/stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import type { BottomTabNavParamList, RootStackParamList } from './root';
import type { Transaction, Account } from '@ledget/shared-features';

export type ModalStackParamList = {
  Activity: {
    expanded?: boolean;
    tab?: number;
  };
  Logout: undefined;
  ConfirmDeletePlaidItem: {
    id: string;
  };
  EditPersonalInfo: undefined;
  ConfirmRemoveCoowner: undefined;
  AddCoOwner: undefined;
  AuthenticatorAppSetup: undefined;
  LogoutAllDevices: undefined;
  RemoveAuthenticator: undefined;
  ChangePassword: undefined;
  Split: {
    transaction: Transaction
  };
  CardPicker: {
    selectedCard: Account;
  }
};

export type ModalScreenProps<T extends keyof ModalStackParamList> =
  CompositeScreenProps<
    StackScreenProps<ModalStackParamList, T>,
    CompositeScreenProps<
      BottomTabScreenProps<BottomTabNavParamList>,
      StackScreenProps<RootStackParamList>
    >
  >;
