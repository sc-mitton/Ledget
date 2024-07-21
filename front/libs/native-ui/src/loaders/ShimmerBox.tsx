import { useRef, useEffect } from 'react';
import { View } from 'react-native';

import { Box } from '../restyled/Box';
import type { BoxProps } from '../restyled/Box';
import { Shimmer } from './Shimmer';
import { Text } from 'react-native';

interface Props extends BoxProps {
  shimmering?: boolean,
  placeholder?: string,
  numberOfLines?: number,
}

export const ShimmerBox = ({ shimmering = true, placeholder, numberOfLines, children, style, ...rest }: Props) => {

  return (
    <Box {...rest} style={[style, { position: 'relative', overflow: 'hidden' }, numberOfLines ? { minHeight: numberOfLines * 28 } : {}]}>
      {shimmering
        ? <Shimmer
          style={{
            position: 'absolute',
            width: '200%',
            height: '200%',
          }} />
        : children}
      {placeholder && shimmering && <Text>{placeholder}</Text>}
    </Box>
  )
}
