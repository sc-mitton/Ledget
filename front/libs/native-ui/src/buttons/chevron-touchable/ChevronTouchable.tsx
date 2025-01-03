import {
  TouchableOpacity,
  View,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';

import styles from './styles';
import { Icon } from '../../restyled/Icon';
import type { IconProps } from '../../restyled/Icon';
import { ChevronDown, ChevronRight } from 'geist-native-icons';

interface Props extends TouchableOpacityProps {
  direction?: 'right' | 'down';
  iconOverride?: React.ComponentType<IconProps>;
  iconStyle?: ViewStyle;
}

export const ChevronTouchable = ({
  direction = 'right',
  children,
  iconStyle,
  iconOverride: OverRide,
  style,
  ...rest
}: Props) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.6}
      {...rest}
    >
      {children}
      <View style={[styles.chevron, iconStyle]}>
        <Icon
          icon={
            direction === 'right'
              ? OverRide || ChevronRight
              : OverRide || ChevronDown
          }
          color="quinaryText"
        />
      </View>
    </TouchableOpacity>
  );
};
