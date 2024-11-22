import { View } from 'react-native';
import { useEffect } from 'react';

import styles from './styles/welcome';
import { OnboardingScreenProps } from '@types';
import { useAppearance } from '@/features/appearanceSlice';
import Animated, { useSharedValue, interpolate, Easing, withTiming, withDelay, useAnimatedStyle } from 'react-native-reanimated';
import { DollarGraphic, LogoIconGrayscale } from '@ledget/media/native';
import { Text, Button, Box } from '@ledget/native-ui';
import { useUpdateUserMutation } from '@ledget/shared-features';

const easing = Easing.bezier(0.25, 0.1, 0.25, 1).factory()

const Welcome = (props: OnboardingScreenProps<'Welcome'>) => {
  const [updateUser] = useUpdateUserMutation();

  const { mode } = useAppearance();
  const y1 = useSharedValue(120);
  const y2 = useSharedValue(120);
  const y3 = useSharedValue(120);
  const y4 = useSharedValue(120);

  useEffect(() => {
    const duration = 1500;
    y1.value = withTiming(0, { duration, easing });
    y2.value = withDelay(200, withTiming(0, { duration, easing }));
    y3.value = withDelay(400, withTiming(0, { duration, easing }));
    y4.value = withDelay(600, withTiming(0, { duration, easing }));
  }, [])

  const style1 = useAnimatedStyle(() => ({
    transform: [{ translateY: y1.value }],
    opacity: interpolate(y1.value, [100, 0], [0, 1])
  }))
  const style2 = useAnimatedStyle(() => ({
    transform: [{ translateY: y2.value }],
    opacity: interpolate(y2.value, [100, 0], [0, 1])
  }))
  const style3 = useAnimatedStyle(() => ({
    transform: [{ translateY: y3.value }],
    opacity: interpolate(y3.value, [100, 0], [0, 1])
  }))
  const style4 = useAnimatedStyle(() => ({
    transform: [{ translateY: y4.value }],
    opacity: interpolate(y4.value, [100, 0], [0, 1])
  }))

  return (
    <Box variant='screen'>
      <View style={styles.mainContainer}>
        <Animated.View style={[styles.image, style1]}>
          <DollarGraphic dark={mode === 'dark'} size={160} />
        </Animated.View>
        <Animated.View style={[style2]}>
          <Text variant='geistSemiBold' fontSize={30} lineHeight={40}>
            Welcome to Ledget
          </Text>
        </Animated.View>
        <Animated.View style={[style2]}>
          <Text color='blueText'>Let's give you a tour and get you set up</Text>
        </Animated.View>
      </View>
      <Animated.View style={style4}>
        <Box paddingBottom='navHeight'>
          <Button
            label='Continue'
            variant='main'
            onPress={() => props.navigation.navigate('Tour')}
          />
          <Button
            label='Skip'
            variant='main'
            textColor='secondaryText'
            backgroundColor='transparent'
            onPress={() => {
              updateUser({ is_onboarded: true })
              props.navigation.navigate('BottomTabs', { screen: 'Budget' } as any)
            }}
          />
        </Box>
      </Animated.View>
    </Box>
  )
};


export default Welcome;
