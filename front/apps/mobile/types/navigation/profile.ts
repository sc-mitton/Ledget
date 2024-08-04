import { StackScreenProps } from '@react-navigation/stack';

export type ProfileStackParamList = {
  Account: undefined,
  Connection: {
    item: string
  },
  Device: {
    id: string
  }
};

// Profile
export type AccountScreenProps = StackScreenProps<ProfileStackParamList, 'Account'>
export type ConnectionScreenProps = StackScreenProps<ProfileStackParamList, 'Connection'>
export type DeviceScreenProps = StackScreenProps<ProfileStackParamList, 'Device'>
