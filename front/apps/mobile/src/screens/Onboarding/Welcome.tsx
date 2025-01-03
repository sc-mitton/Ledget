import { View } from 'react-native';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import styles from './styles/welcome';
import sharedStyles from './styles/shared';
import { OnboardingScreenProps } from '@types';
import { useAppearance } from '@/features/appearanceSlice';
import Animated, {
  useSharedValue,
  interpolate,
  Easing,
  withTiming,
  withDelay,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { LogoIconGrayscale } from '@ledget/media/native';
import { Text, Button, Box } from '@ledget/native-ui';
import { useUpdateUserMutation } from '@ledget/shared-features';
import { useProgress } from './Header';

const easing = Easing.bezier(0.25, 0.1, 0.25, 1).factory();

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
  const y1 = useSharedValue(80);
  const y2 = useSharedValue(80);
  const buttonsOpacity = useSharedValue(0);

  useEffect(() => {
    const duration = 1500;
    y1.value = withTiming(0, { duration, easing });
    y2.value = withDelay(400, withTiming(0, { duration, easing }));
    buttonsOpacity.value = withDelay(1000, withTiming(1, { duration, easing }));
  }, []);

  const graphicStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: y1.value }],
    opacity: interpolate(y1.value, [80, 0], [0, 1]),
  }));
  const textStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: y2.value }],
    opacity: interpolate(y2.value, [70, 0], [0, 1]),
  }));
  const buttonsStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
  }));

  return (
    <Box variant="screen">
      <View style={[styles.mainContainer, sharedStyles.mainContainer]}>
        <Animated.View style={[styles.image, graphicStyle]}>
          <LogoIconGrayscale dark={mode === 'dark'} size={40} />
        </Animated.View>
        <Animated.View style={[textStyle]}>
          <Text
            variant={mode === 'dark' ? 'geistSemiBold' : 'geistBold'}
            fontSize={30}
            lineHeight={40}
          >
            Welcome to Ledget
          </Text>
        </Animated.View>
        <Animated.View style={[textStyle]}>
          <Text color="blueText">Let's give you a tour and get you set up</Text>
        </Animated.View>
      </View>
      <Animated.View style={buttonsStyle}>
        <Box paddingBottom="navHeight">
          <Button
            label="Continue"
            variant="main"
            onPress={() => props.navigation.navigate('TourSpending')}
          />
          <Button
            label="Skip"
            variant="main"
            textColor="mainText"
            backgroundColor="transparent"
            labelPlacement="left"
            onPress={() => {
              updateUser({ is_onboarded: true });
              props.navigation.navigate('BottomTabs', {
                screen: 'Budget',
              } as any);
            }}
          />
        </Box>
      </Animated.View>
    </Box>
  );
};

export default Welcome;
