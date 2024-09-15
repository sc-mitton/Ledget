import type { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import type { BottomTabNavParamList, RootStackParamList } from './root';
import { StackScreenProps } from '@react-navigation/stack';

export type ActivityParamList = {
  History: {
    expanded?: boolean;
  };
  New: {
    expanded?: boolean;
  };
};

export type ActivityScreenProps<T extends keyof ActivityParamList> = CompositeScreenProps<
  StackScreenProps<ActivityParamList, T>,
  CompositeScreenProps<BottomTabScreenProps<BottomTabNavParamList>, StackScreenProps<RootStackParamList>>
>;
