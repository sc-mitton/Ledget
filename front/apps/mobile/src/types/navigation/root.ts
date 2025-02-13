import { NavigatorScreenParams } from '@react-navigation/native';
import { createNavigationContainerRef } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import type { LoginStackParamList } from './login';
import type { ModalStackParamList, PageSheetModalParamList } from './modals';
import { Transaction } from '@ledget/shared-features';
import { OnboardingStackParamList } from './onboarding';
import { BottomTabNavParamList } from './bottomNav';
import { ProfileStackParamList } from './profile';

export type RootStackParamList = {
  BottomTabs: NavigatorScreenParams<BottomTabNavParamList>;
  Modals: NavigatorScreenParams<ModalStackParamList>;
  PageSheetModals: NavigatorScreenParams<PageSheetModalParamList>;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Transaction: {
    transaction: Transaction | string;
    options?: {
      asModal?: boolean;
      rename?: boolean;
    };
  };
};

export type RootAuthenticationStackParamList = {
  Login: NavigatorScreenParams<LoginStackParamList>;
  Recovery: {
    identifier: string;
  };
  Verification: {
    identifier: string;
  };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;
export type RecoveryScreenProps = StackScreenProps<
  RootAuthenticationStackParamList,
  'Recovery'
>;
export type VerificationScreenProps = StackScreenProps<
  RootAuthenticationStackParamList,
  'Verification'
>;

export const navigationRef = createNavigationContainerRef<RootStackParamList>();
