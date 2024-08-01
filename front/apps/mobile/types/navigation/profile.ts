import { StackScreenProps } from '@react-navigation/stack';

export type ProfileStackParamList = {
  Profile: undefined,
  Connection: {
    item: string
  },
  Device: {
    id: string
  }
};

// Profile
export type ProfileScreenProps = StackScreenProps<ProfileStackParamList, 'Profile'>
export type ConnectionScreenProps = StackScreenProps<ProfileStackParamList, 'Connection'>
export type DeviceScreenProps = StackScreenProps<ProfileStackParamList, 'Device'>
