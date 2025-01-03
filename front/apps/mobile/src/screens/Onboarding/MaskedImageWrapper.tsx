import { View, Dimensions, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Canvas, Rect, LinearGradient, vec } from '@shopify/react-native-skia';

import styles from './styles/masked-image-wrapper';

const HEIGHT = 75;

const MaskedImageWrapper = ({
  children,
  maskPosition = 'bottom',
}: {
  children: React.ReactNode;
  maskPosition?: 'top' | 'bottom';
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.maskedImageContainer,
        maskPosition === 'top'
          ? styles.maskedImageContainerTop
          : styles.maskedImageContainerBottom,
      ]}
    >
      <Canvas
        style={[
          styles.canvas,
          { height: HEIGHT },
          maskPosition === 'top' ? styles.topCanvas : styles.bottomCanvas,
        ]}
      >
        <Rect
          x={0}
          y={0}
          width={Dimensions.get('window').width}
          height={HEIGHT}
        >
          <LinearGradient
            colors={
              maskPosition === 'top'
                ? [
                    theme.colors.mainBackground,
                    theme.colors.blueChartGradientEnd,
                  ]
                : [
                    theme.colors.blueChartGradientEnd,
                    theme.colors.mainBackground,
                  ]
            }
            start={vec(0, HEIGHT / 4)}
            end={vec(0, HEIGHT)}
          />
        </Rect>
      </Canvas>
      <View
        style={
          maskPosition === 'top'
            ? styles.maskedImageTop
            : styles.maskedImageBottom
        }
      >
        {children}
      </View>
    </View>
  );
};

export default MaskedImageWrapper;
