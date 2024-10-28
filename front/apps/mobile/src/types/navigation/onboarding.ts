import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootAuthenticationStackParamList } from './root';

export type OnboardingStackParamList = {
};

export type OnboardingScreenProps<T extends keyof OnboardingStackParamList> =
  CompositeScreenProps<
    StackScreenProps<OnboardingStackParamList, T>,
    StackScreenProps<RootAuthenticationStackParamList>
  >
