import { View } from 'react-native';

import {
  ColorProps,
  BorderProps,
  composeRestyleFunctions,
  color,
  border,
  useRestyle
} from '@shopify/restyle';
import { Theme } from '../theme';

const restyleFunctions = composeRestyleFunctions([color, border])

export type IconProps = {
  size: number;
  stroke: string;
  fill: string;
}

interface ExtraProps {
  strokeWidth?: number;
  icon: React.ComponentType<IconProps>;
  size?: number;
  rotate?: number;
}
type Props = ColorProps<Theme> & BorderProps<Theme> & ExtraProps;

export const Icon = ({ icon: Icon, size = 20, color = 'mainText', ...rest }: Props) => {
  const props = useRestyle(restyleFunctions as any, { color, ...rest });

  return (
    <View style={{ transform: [{ rotate: `${rest.rotate || 0}deg` }] }}>
      <Icon
        size={size}
        stroke={(props as any).style[0].borderColor || (props as any).style[0].color}
        fill={(props as any).style[0].borderColor ? (props as any).style[0].borderColor : 'none'}
        {...props}
      />
    </View>
  )
}
