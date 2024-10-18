import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import type { BottomTabNavParamList } from './bottomNav';
import type { RootStackParamList } from './root';

export type HomeStackParamList = {
  Main: {
    editMode: boolean;
  }
};

export type HomeScreenProps<T extends keyof HomeStackParamList> =
  CompositeScreenProps<
    StackScreenProps<HomeStackParamList, T>,
    CompositeScreenProps<BottomTabScreenProps<BottomTabNavParamList>, StackScreenProps<RootStackParamList>>
  >;
