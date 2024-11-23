import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from './root';

export type OnboardingStackParamList = {
  Welcome: undefined;
  TourSpending: undefined;
  TourBills: undefined;
  TourActivity: undefined;
  TourAccounts: undefined;
  Connect: undefined;
  AddCategories: undefined;
  AddBills: undefined;
};

export type OnboardingScreenProps<T extends keyof OnboardingStackParamList> =
  CompositeScreenProps<
    StackScreenProps<OnboardingStackParamList, T>,
    StackScreenProps<RootStackParamList>
  >
