import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import type { BottomTabNavParamList } from './bottomNav';
import type { RootStackParamList } from './root';

export type ConnectionsStackParamList = {
  All: undefined
  Connection: {
    item: string
  }
};

export type SecurityStackParamList = {
  Main: undefined
  Device: {
    key: string[],
  },
};

export type ProfileStackParamList = {
  Main: undefined,
  Connections: NavigatorScreenParams<ConnectionsStackParamList>,
  Security: NavigatorScreenParams<SecurityStackParamList>,
  CoOwner: undefined
  Settings: undefined
};

export type ProfileScreenProps<T extends keyof ProfileStackParamList> =
  CompositeScreenProps<
    StackScreenProps<ProfileStackParamList, T>,
    CompositeScreenProps<BottomTabScreenProps<BottomTabNavParamList>, StackScreenProps<RootStackParamList>>
  >;

export type ConnectionsScreenProps<T extends keyof ConnectionsStackParamList> =
  CompositeScreenProps<
    StackScreenProps<ConnectionsStackParamList, T>,
    CompositeScreenProps<BottomTabScreenProps<BottomTabNavParamList>, StackScreenProps<RootStackParamList>>
  >;

export type SecurityScreenProps<T extends keyof SecurityStackParamList> =
  CompositeScreenProps<
    StackScreenProps<SecurityStackParamList, T>,
    CompositeScreenProps<BottomTabScreenProps<BottomTabNavParamList>, StackScreenProps<RootStackParamList>>
  >;
