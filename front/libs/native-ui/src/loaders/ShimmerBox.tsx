import styles from './styles/shimmer-box';
import { Box } from '../restyled/Box';
import type { BoxProps } from '../restyled/Box';
import { Shimmer } from './Shimmer';
import { Text } from 'react-native';

interface Props extends BoxProps {
  shimmering?: boolean,
  placeholder?: string,
  numberOfLines?: number,
}

export const ShimmerBox = (props: Props) => {
  const {
    shimmering = true,
    placeholder,
    numberOfLines,
    children,
    style,
    ...rest
  } = props;

  return (
    <Box {...rest} style={[style, styles.box, (numberOfLines && shimmering) ? { minHeight: numberOfLines * 28 } : {}]}>
      {shimmering && <Shimmer style={styles.boxShimmer} />}
      {shimmering && <Box style={styles.overlay} backgroundColor={rest.backgroundColor} />}
      {children}
      {placeholder && shimmering && <Text>{placeholder}</Text>}
    </Box>
  )
}
