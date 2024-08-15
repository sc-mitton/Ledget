import { StackScreenProps } from '@react-navigation/stack';
import type { Device } from '@ledget/shared-features';

export type ProfileStackParamList = {
  Profile: undefined,
  Connection: {
    item: string
  },
  Device: {
    key: string[],
  },
  PersonalInfo: undefined,
  CoOwner: undefined,
};

export type AccountScreenProps = StackScreenProps<ProfileStackParamList, 'Profile'>
export type ConnectionScreenProps = StackScreenProps<ProfileStackParamList, 'Connection'>
export type DeviceScreenProps = StackScreenProps<ProfileStackParamList, 'Device'>
export type PersonalInfoScreenProps = StackScreenProps<ProfileStackParamList, 'PersonalInfo'>
