import { View } from 'react-native';

import styles from './styles';
import { useTheme } from '@shopify/restyle';
import { Text } from '../../restyled/Text';
import { Switch as NativeSwitch, SwitchProps } from 'react-native-switch';

export const Switch = (props: SwitchProps & { label: string }) => {
  const theme = useTheme();
  const { label, ...rest } = props;

  return (
    <View style={[styles.switch, rest.disabled ? styles.disabled : undefined]}>
      {label && <Text>{label}</Text>}
      <NativeSwitch
        activeText=''
        inActiveText=''
        circleSize={18}
        barHeight={22}
        switchRightPx={3}
        switchLeftPx={3}
        circleBorderWidth={0}
        switchWidthMultiplier={2.25}
        outerCircleStyle={{
          shadowColor: rest.value ? theme.colors.activeSwitchShadow : theme.colors.inactiveSwitchShadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 1,
          shadowRadius: 2,
        }}
        circleActiveColor={theme.colors.enabledSwitchPill}
        circleInActiveColor={theme.colors.disabledSwitchPill}
        backgroundActive={theme.colors.enabledSwitchCrib}
        backgroundInactive={theme.colors.disabledSwitchCrib}
        {...rest}
      />
    </View>
  )
}
