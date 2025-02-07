import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { Category } from '@ledget/shared-features';
import type { BottomTabNavParamList } from './bottomNav';
import type { RootStackParamList } from './root';

export type BentoState = 'editing' | 'picking' | 'dropping' | 'idle';

export type HomeStackParamList = {
  Main: { state: BentoState };
  Category: { category: Category };
};

export type HomeScreenProps<T extends keyof HomeStackParamList> =
  CompositeScreenProps<
    StackScreenProps<HomeStackParamList, T>,
    CompositeScreenProps<
      BottomTabScreenProps<BottomTabNavParamList>,
      StackScreenProps<RootStackParamList>
    >
  >;
