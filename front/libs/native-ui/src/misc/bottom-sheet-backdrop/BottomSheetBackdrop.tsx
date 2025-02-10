import { Dimensions, StyleSheet, useColorScheme, Platform } from 'react-native';
import { Box } from '@ledget/native-ui';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

export const BottomSheetBackdrop = ({ blurIntensity = 20 }) => {
  const scheme = useColorScheme();
  return Platform.OS === 'ios' ? (
    <Animated.View exiting={FadeOut} entering={FadeIn} style={styles.overlay}>
      <BlurView
        style={[StyleSheet.absoluteFillObject, { zIndex: 0 }]}
        intensity={blurIntensity}
        experimentalBlurMethod={'dimezisBlurView'}
        tint={scheme === 'dark' ? 'dark' : 'light'}
      />
      <Box
        style={[StyleSheet.absoluteFillObject, { zIndex: 1 }]}
        opacity={0.5}
        backgroundColor="modalOverlay"
        shadowOffset={{ width: 0, height: 4 }}
        shadowRadius={12}
        shadowOpacity={0.5}
      />
    </Animated.View>
  ) : (
    <Animated.View exiting={FadeOut} entering={FadeIn} style={styles.overlay}>
      <Box
        style={StyleSheet.absoluteFillObject}
        opacity={0.9}
        backgroundColor="modalOverlay"
        shadowOffset={{ width: 0, height: 4 }}
        shadowRadius={12}
        shadowOpacity={0.5}
      />
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: -Dimensions.get('window').width,
    left: 0,
    right: 0,
    bottom: -Dimensions.get('window').width,
  },
});
