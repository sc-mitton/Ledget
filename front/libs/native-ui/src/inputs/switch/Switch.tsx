import { View } from 'react-native';

import styles from './styles';
import { useTheme } from '@shopify/restyle';
import { Text } from '../../restyled/Text';
import { Switch as NativeSwitch, SwitchProps } from 'react-native-switch';

export const Switch = (props: SwitchProps & { label: string }) => {
  const theme = useTheme();
  const { label, ...rest } = props;

  return (
    <View style={styles.switch}>
      {label && <Text>{label}</Text>}
      <View style={[rest.disabled ? styles.disabled : undefined]}>
        <NativeSwitch
          activeText=''
          inActiveText=''
          circleSize={22}
          barHeight={26}
          switchRightPx={2.5}
          switchLeftPx={2.5}
          circleBorderWidth={0}
          switchWidthMultiplier={2.25}
          outerCircleStyle={{
            shadowColor: rest.value ? theme.colors.activeSwitchShadow : theme.colors.disabledSwitchShadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 1,
            shadowRadius: 2,
          }}
          circleActiveColor={rest.disabled ? theme.colors.disabledSwitchPill : theme.colors.enabledSwitchPill}
          circleInActiveColor={theme.colors.disabledSwitchPill}
          backgroundActive={rest.disabled ? theme.colors.disabledSwitchCrib : theme.colors.enabledSwitchCrib}
          backgroundInactive={theme.colors.disabledSwitchCrib}
          {...rest}
        />
      </View>
    </View>
  )
}
