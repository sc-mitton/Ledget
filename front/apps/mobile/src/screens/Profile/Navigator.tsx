import { useRef } from 'react';
import {
  View,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions
} from 'react-native';
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
  const panelsHeight = useSharedValue(0);

  const scrollViewRef = useRef<ScrollView>(null);

  const contentHeight = useRef(0);
  const containerHeight = useRef(0);

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

  const panelsAnimation = useAnimatedStyle(() => ({
    paddingTop: interpolate(headerHeight.value, [0, H_SCROLL_DISTANCE], [0, H_SCROLL_DISTANCE], Extrapolation.CLAMP),
    minHeight: panelsHeight.value,
  }));

  return (
    <View style={styles.full}>
      <Animated.View style={[animatedPadding]}>
        <TabsNavigator tabs={scenes} props={props} >
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
              if (containerHeight.current >= contentHeight.current) return;
              headerHeight.value = event.nativeEvent.contentOffset.y;
            }
            }
            onScrollEndDrag={(event: { nativeEvent: { contentOffset: { y: number } } }) => {
              if (containerHeight.current >= contentHeight.current) return;
              const { y } = event.nativeEvent.contentOffset;

              if (y < H_SCROLL_DISTANCE / 1.5) {
                headerHeight.value = withSpring(0, defaultSpringConfig);
                scrollViewRef.current?.scrollTo({ y: 0, animated: true });
              } else {
                headerHeight.value = withSpring(H_MAX_HEIGHT, defaultSpringConfig);
              }
            }}
            scrollEventThrottle={16}
            stickyHeaderIndices={[0]}
            onContentSizeChange={(w, h) => { contentHeight.current = h }}
            onLayout={(event) => { containerHeight.current = event.nativeEvent.layout.height }}
          >
            <TabsNavigator.Tabs />
            <Animated.View style={[panelsAnimation]}>
              <TabsNavigator.Panels />
            </Animated.View>
            {containerHeight.current >= containerHeight.current && <View style={{ height: 50 }} />}
          </ScrollView >
        </TabsNavigator>
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
