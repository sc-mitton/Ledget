import { NavigatorScreenParams } from '@react-navigation/native';

import type { ProfileStackParamList } from './profile';
import { AccountsStackParamList } from './accounts';
import { BudgetStackParamList } from './budget';

export type BottomTabNavParamList = {
  Home: undefined;
  Budget: NavigatorScreenParams<BudgetStackParamList>;
  Accounts: NavigatorScreenParams<AccountsStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};
