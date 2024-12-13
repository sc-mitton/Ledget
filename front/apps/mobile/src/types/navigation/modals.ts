import { StackScreenProps } from '@react-navigation/stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import type { BottomTabNavParamList } from './bottomNav';
import type { AccountsStackParamList } from './accounts';
import type { RootStackParamList } from './root';
import type { Transaction, Account, AccountType, Bill, Category } from '@ledget/shared-features';

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
  SplitModal: {
    transaction: Transaction
  };
  CardPicker: {
    selectedCard: Account;
  },
  PickAccount: {
    accountType: AccountType
    options?: {
      title?: string,
      reorder?: boolean,
      order?: 'balance-asc' | 'balance-desc' | 'name-asc' | 'name-desc'
    }
  },
  PickerCard: {
    currentAccount?: string
    options?: {
      title?: string,
      reorder?: boolean,
      order?: 'balance-asc' | 'balance-desc' | 'name-asc' | 'name-desc'
    }
  },
  NewBill: {
    transaction?: Transaction;
    bill?: Partial<Bill>;
    options?: {
      title?: string
    }
  } | undefined;
  NewCategory: {
    period?: Category['period'];
    category?: Category;
    options?: {
      title?: string
    }
  } | undefined;
  ConfirmDeleteCategory: {
    category: Category
  }
  ConfirmDeleteBill: {
    bill: Bill
  },
  Holdings: undefined;
  BillsCalendar: {
    month: number;
    year: number;
  },
  Transaction: AccountsStackParamList['Transaction']
};

export type ModalScreenProps<T extends keyof ModalStackParamList> =
  CompositeScreenProps<
    StackScreenProps<ModalStackParamList, T>,
    CompositeScreenProps<
      BottomTabScreenProps<BottomTabNavParamList>,
      StackScreenProps<RootStackParamList>
    >
  >;
