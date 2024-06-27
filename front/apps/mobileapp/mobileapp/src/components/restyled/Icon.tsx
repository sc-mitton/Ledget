import {
  ColorProps,
  BorderProps,
  composeRestyleFunctions,
  color,
  border,
  useRestyle
} from '@shopify/restyle';
import { Theme } from '@theme';

const restyleFunctions = composeRestyleFunctions([color, border])
type Props = ColorProps<Theme> & BorderProps<Theme> & { icon: React.ComponentType<any>, size?: number };

export const Icon = ({ icon: Icon, size = 20, color = 'mainText', ...rest }: Props) => {
  const props = useRestyle(restyleFunctions as any, { color, ...rest });

  return <Icon
    size={size}
    stroke={(props as any).style[0].borderColor || (props as any).style[0].color}
    {...props}
  />
}
