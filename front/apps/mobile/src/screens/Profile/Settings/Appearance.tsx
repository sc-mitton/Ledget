import { View, TouchableOpacity } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { CheckInCircle } from 'geist-native-icons';

import styles from './styles';
import {
  setCustomMode,
  setUseDeviceApperance,
  selectCustomMode,
  selectUseDeviceAppearance,
  useAppearance
} from '@features/appearanceSlice';
import { Box, BoxHeader, Icon, Text } from '@ledget/native-ui';
import { PhoneAppearance } from '@ledget/media/native';
import { useAppDispatch, useAppSelector } from '@/hooks';

interface OptionP {
  onPress: () => void
  selected: boolean
  imageMode: 'dark' | 'light' | 'default'
}

const Option = ({ onPress, selected, imageMode }: OptionP) => {
  const { mode } = useAppearance();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.option}
      activeOpacity={.7}>
      {selected &&
        <Box
          borderColor='focusedInputBorderMain'
          style={[styles.optionBorder, styles.optionBorderMain]}
        />}
      {selected &&
        <Box
          borderColor='focusedInputBorderSecondary'
          style={[styles.optionBorder, styles.optionBorderSecondary]}
        />}
      <View style={styles.phoneImageContainer}>
        <PhoneAppearance
          appearance={
            DeviceInfo.hasDynamicIsland()
              ? 'dynamic'
              : DeviceInfo.hasNotch() ? 'notch' : 'punch-hole'}
          mode={mode}
          imageMode={imageMode}
        />
      </View>
      <View style={styles.optionTextContainer}>
        <View style={styles.optionText}>
          {selected &&
            <Icon
              icon={CheckInCircle}
              strokeWidth={2.25}
              size={16}
              color='blueText'
            />}
          <Text color={selected ? 'blueText' : 'secondaryText'}>
            {imageMode.charAt(0).toUpperCase() + imageMode.slice(1)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const Appearance = () => {
  const dispatch = useAppDispatch();

  const customMode = useAppSelector(selectCustomMode);
  const useDeviceAppearance = useAppSelector(selectUseDeviceAppearance)

  return (
    <>
      <BoxHeader>Appearance</BoxHeader>
      <Box backgroundColor='nestedContainer' variant='nestedContainer' style={styles.radios}>
        <Option
          onPress={() => dispatch(setUseDeviceApperance(true))}
          selected={useDeviceAppearance}
          imageMode='default'
        />
        <Option
          onPress={() => {
            dispatch(setCustomMode('light'))
            dispatch(setUseDeviceApperance(false))
          }}
          selected={!useDeviceAppearance && customMode === 'light'}
          imageMode='light'
        />
        <Option
          onPress={() => {
            dispatch(setCustomMode('dark'))
            dispatch(setUseDeviceApperance(false))
          }}
          selected={!useDeviceAppearance && customMode === 'dark'}
          imageMode='dark'
        />
      </Box>
    </>
  )
}

export default Appearance
