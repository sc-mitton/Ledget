import { StackScreenProps } from '@react-navigation/stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import type { BottomTabNavParamList } from './root';

export type ProfileStackParamList = {
  Main: undefined,
  Connection: {
    item: string
  },
  Device: {
    key: string[],
  },
  PersonalInfo: undefined,
  CoOwner: undefined
};

export type ProfileScreenProps<T extends keyof ProfileStackParamList> =
  CompositeScreenProps<
    StackScreenProps<ProfileStackParamList, T>,
    BottomTabScreenProps<BottomTabNavParamList>
  >;
