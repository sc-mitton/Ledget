import { View } from 'react-native';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import styles from './styles/welcome';
import sharedStyles from './styles/shared';
import { OnboardingScreenProps } from '@types';
import { useAppearance } from '@/features/appearanceSlice';
import Animated, { useSharedValue, interpolate, Easing, withTiming, withDelay, useAnimatedStyle } from 'react-native-reanimated';
import { DollarGraphic } from '@ledget/media/native';
import { Text, Button, Box } from '@ledget/native-ui';
import { useUpdateUserMutation } from '@ledget/shared-features';
import { useProgress } from './Header';

const easing = Easing.bezier(0.25, 0.1, 0.25, 1).factory()

const Welcome = (props: OnboardingScreenProps<'Welcome'>) => {
  const [updateUser] = useUpdateUserMutation();
  const { setIndex, setSize } = useProgress();

  const nav = useNavigation();

  useEffect(() => {
    nav.addListener('state', (state) => {
      setIndex(state.data.state.index);
      setSize(state.data.state.routeNames.length - 1);
    });
  }, []);

  const { mode } = useAppearance();
  const y1 = useSharedValue(120);
  const y2 = useSharedValue(120);
  const y3 = useSharedValue(120);

  useEffect(() => {
    const duration = 1500;
    y1.value = withTiming(0, { duration, easing });
    y2.value = withDelay(200, withTiming(0, { duration, easing }));
    y3.value = withDelay(400, withTiming(0, { duration, easing }));
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

  return (
    <Box variant='screen'>
      <View style={[styles.mainContainer, sharedStyles.mainContainer]}>
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
      <Animated.View style={style3}>
        <Box paddingBottom='navHeight'>
          <Button
            label='Continue'
            variant='main'
            onPress={() => props.navigation.navigate('TourSpending')}
          />
          <Button
            label='Skip'
            variant='main'
            textColor='mainText'
            backgroundColor='transparent'
            labelPlacement='left'
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
