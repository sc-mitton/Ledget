import { View } from 'react-native';
import { Box, BoxHeader, Switch, useAppearance } from '@ledget/native-ui';

const Preferences = () => {
  const appearance = useAppearance();

  return (
    <>
      <BoxHeader>Preferences</BoxHeader>
      <Box variant='nestedContainer' backgroundColor='nestedContainer'>
        <View style={{ flex: 1 }}>
          <Switch
            label={'Use Device Appearance'}
            value={!appearance.useCustomMode}
            onValueChange={(b) => appearance.setUseCustomMode(b)}
            disabled={appearance.useCustomMode}
          />
          <Switch
            label={appearance.customMode === 'dark' ? 'Dark Mode' : 'Light Mode'}
            value={appearance.customMode === 'light'}
            onValueChange={(b) => appearance.setCustomMode(b ? 'light' : 'dark')}
            disabled={!appearance.useCustomMode}
          />
        </View>
      </Box>
    </>
  )
}

export default Preferences
