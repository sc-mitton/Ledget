import { View } from 'react-native';

import { setCustomMode, setUseDeviceApperance, selectCustomMode, selectUseDeviceAppearance } from '@features/appearanceSlice';
import { Box, BoxHeader, Switch } from '@ledget/native-ui';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { AccountScreenProps } from '@types';

const Screen = (props: AccountScreenProps) => {
  const dispatch = useAppDispatch();

  const customMode = useAppSelector(selectCustomMode);
  const useDeviceAppearance = useAppSelector(selectUseDeviceAppearance)

  return (
    <Box variant='screenContent'>
      <BoxHeader>Appearance</BoxHeader>
      <Box variant='nestedContainer' backgroundColor='nestedContainer'>
        <View style={{ flex: 1 }}>
          <Switch
            label={'Use Device Appearance'}
            value={useDeviceAppearance}
            onValueChange={(b) => dispatch(setUseDeviceApperance(b))}
          />
          <Switch
            label={'Dark Mode'}
            value={customMode === 'dark'}
            onValueChange={(b) => dispatch(setCustomMode(b ? 'dark' : 'light'))}
            disabled={useDeviceAppearance}
          />
        </View>
      </Box>
    </Box>
  )
}

export default Screen
