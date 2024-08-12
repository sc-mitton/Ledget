import { useCallback, useEffect, useRef } from 'react';
import { View, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  interpolate,
  Extrapolation,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';
import { createStackNavigator } from "@react-navigation/stack";

import styles from './styles/navigator';
import { Header, Box } from '@ledget/native-ui';
import { useGetMeQuery } from '@ledget/shared-features';
import { TabsNavigator, Avatar, Text, ChevronTouchable, defaultSpringConfig } from '@ledget/native-ui';
import { ProfileStackParamList } from '@types';
import { BackHeader } from '@ledget/native-ui';
import { setModal } from '@/features/modalSlice';
import { useAppDispatch, useCardStyleInterpolator } from "@/hooks";
import { AccountScreenProps } from '@types';
import Account from './Account/Screen';
import Security from './Security/Screen';
import Settings from './Settings/Screen';
import Connection from './Account/Connection/Screen';
import Device from './Security/Device/Screen';
import CoOwner from './Account/CoOwner/Screen';

const scenes = {
  account: Account,
  settings: Settings,
  security: Security
};

const H_MIN_HEIGHT = 35;
const H_MAX_HEIGHT = 125;
const H_MIN_SCALE = .7;
const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;

const Stack = createStackNavigator<ProfileStackParamList>();

function Profile(props: AccountScreenProps) {
  const { data: user } = useGetMeQuery();
  const dispatch = useAppDispatch();
  const headerHeight = useSharedValue(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const onScroll = useCallback((event: { nativeEvent: { contentOffset: { y: number } } }) => {
    const { y } = event.nativeEvent.contentOffset;
    headerHeight.value = y;
  }, []);

  const onEndScroll = useCallback((event: { nativeEvent: { contentOffset: { y: number } } }) => {
    const { y } = event.nativeEvent.contentOffset;
    if (y < H_SCROLL_DISTANCE / 1.5) {
      headerHeight.value = withSpring(0, defaultSpringConfig);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      headerHeight.value = withSpring(H_MAX_HEIGHT, defaultSpringConfig);
    }
  }, []);

  const animatedHeight = useAnimatedStyle(() => ({
    height: interpolate(headerHeight.value, [0, H_SCROLL_DISTANCE], [H_MAX_HEIGHT, H_MIN_HEIGHT], Extrapolation.CLAMP),
  }));

  const animatedScaleOpacity = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(headerHeight.value, [0, H_SCROLL_DISTANCE], [1, H_MIN_SCALE], Extrapolation.CLAMP) }],
    opacity: interpolate(headerHeight.value, [0, H_SCROLL_DISTANCE], [1, 0], Extrapolation.CLAMP),
  }));

  const animatedPadding = useAnimatedStyle(() => ({
    paddingTop: interpolate(headerHeight.value, [0, H_SCROLL_DISTANCE], [H_MAX_HEIGHT, H_MIN_HEIGHT], Extrapolation.CLAMP),
  }));

  return (
    <View style={styles.full}>
      <Animated.View style={[animatedPadding]}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          onScrollEndDrag={onEndScroll}
          scrollEventThrottle={16}
          stickyHeaderIndices={[0]}
        >
          <TabsNavigator
            screens={scenes}
            screenProps={props}
          />
        </ScrollView >
      </Animated.View>
      <Animated.View style={[styles.animatedHeader, styles.header, animatedHeight]}>
        <Box variant='header'>
          <Header>Profile</Header>
          <Animated.View style={animatedScaleOpacity}>
            <Box
              paddingHorizontal='s'
              paddingVertical='l'
              style={styles.userInfoContainer}>
              <ChevronTouchable onPress={() => dispatch(setModal('editPersonalInfo'))}>
                <Avatar size='l' name={user?.name} />
                <View style={styles.userInfo}>
                  <Text color='highContrastText'>{user?.name.first} {user?.name.last}</Text>
                  <Text color='tertiaryText'>{user?.email}</Text>
                </View>
              </ChevronTouchable>
            </Box>
          </Animated.View>
        </Box>
      </Animated.View>
    </View>
  );
}

export default function Navigator() {
  const cardStyleInterpolator = useCardStyleInterpolator();

  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <BackHeader {...props} />,
        cardStyleInterpolator,
      }}
      id='profile'
    >
      <Stack.Screen options={{ headerShown: false }} name='Profile' component={Profile} />
      <Stack.Screen name='Connection' component={Connection} />
      <Stack.Screen name='Device' component={Device} />
      <Stack.Screen name='CoOwner' component={CoOwner} />
    </Stack.Navigator>
  );
}
