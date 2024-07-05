import { useEffect, useState } from 'react';
import { Animated, View } from 'react-native';

import styles from './styles';
import type { Size } from './types';
import { usePulse } from './usePulse';
import { useTheme } from '@shopify/restyle';

const sizes = {
  s: 48,
  m: 64,
  l: 84,
};

export const Pulse = ({ size = 'l', success }: { size?: Size, success: boolean }) => {
  const theme = useTheme();
  const [successColor, setSuccessCollor] = useState(false);
  const { innerScale, outerScale, succeed } = usePulse({ onSuccess: () => setSuccessCollor(true) });

  useEffect(() => {
    if (success) {
      succeed();
    }
  }, [success, succeed]);

  return (
    <View style={styles.pulseContainer}>
      <Animated.View
        style={{
          transform: [{ scale: innerScale }],
          zIndex: -1,
          backgroundColor: successColor ? theme.colors.pulseSuccess : theme.colors.pulseWaiting,
          width: sizes[size],
          height: sizes[size],
          opacity: .25,
          ...styles.radialGradient
        }}
      />
      <Animated.View
        style={{
          transform: [{ scale: outerScale }],
          zIndex: -2,
          opacity: .15,
          backgroundColor: successColor ? theme.colors.pulseSuccess : theme.colors.pulseWaiting,
          width: sizes[size],
          height: sizes[size],
          ...styles.radialGradient
        }}
      />
    </View>
  )
};
