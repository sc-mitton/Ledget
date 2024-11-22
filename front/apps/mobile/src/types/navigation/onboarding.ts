import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from './root';

export type OnboardingStackParamList = {
  Welcome: undefined;
  Tour: undefined;
};

export type OnboardingScreenProps<T extends keyof OnboardingStackParamList> =
  CompositeScreenProps<
    StackScreenProps<OnboardingStackParamList, T>,
    StackScreenProps<RootStackParamList>
  >
