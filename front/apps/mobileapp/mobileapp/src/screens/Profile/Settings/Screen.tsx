import { View } from 'react-native';
import { Box, BoxHeader, Switch, useAppearance } from '@ledget/native-ui';

const Preferences = (props: any) => {
  const appearance = useAppearance();

  return (
    <Box variant='screenContent'>
      <BoxHeader>Appearance</BoxHeader>
      <Box variant='nestedContainer' backgroundColor='nestedContainer'>
        <View style={{ flex: 1 }}>
          <Switch
            label={'Use Device Appearance'}
            value={appearance.useDeviceAppearance}
            onValueChange={(b) => {
              appearance.setUseDeviceApperance(b);
            }}
          />
          <Switch
            label={'Dark Mode'}
            value={appearance.customMode === 'dark'}
            onValueChange={(b) => appearance.setCustomMode(b ? 'dark' : 'light')}
            disabled={appearance.useDeviceAppearance}
          />
        </View>
      </Box>
    </Box>
  )
}

export default Preferences
