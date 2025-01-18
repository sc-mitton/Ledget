import styles from './styles/pulse-box';
import { Box } from '../restyled/Box';
import type { BoxProps } from '../restyled/Box';
import { Pulse } from './Pulse';
import { Text } from 'react-native';

interface Props extends BoxProps {
  pulsing?: boolean;
  placeholder?: string;
  numberOfLines?: number;
}

export const PulseBox = (props: Props) => {
  const {
    pulsing = true,
    placeholder,
    numberOfLines,
    children,
    style,
    backgroundColor,
    ...rest
  } = props;

  return (
    <Box
      {...rest}
      backgroundColor={pulsing ? 'transparent' : backgroundColor}
      style={[
        style,
        styles.box,
        numberOfLines && pulsing ? { minHeight: numberOfLines * 28 } : {},
      ]}
    >
      {pulsing ? <Pulse /> : children}
      {placeholder && pulsing && <Text>{placeholder}</Text>}
    </Box>
  );
};
