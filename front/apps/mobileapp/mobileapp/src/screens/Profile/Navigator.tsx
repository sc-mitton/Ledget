import { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
  TabView,
  SceneMap,
  SceneRendererProps,
  NavigationState
} from 'react-native-tab-view';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  ReduceMotion
} from 'react-native-reanimated';
import styles from './styles/navigator';
import { Header, Text, Box, Seperator } from '@ledget/native-ui';
import Account from './Account/Screen';
import Security from './Security/Screen';
import Connections from './Connections/Screen';

const renderScene = SceneMap({
  account: Account,
  security: Security,
  connections: Connections,
});

export default function Portfolio() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'account', title: 'Account' },
    { key: 'security', title: 'Security' },
    { key: 'connections', title: 'Connections' },
  ]);
  const height = useSharedValue(0);
  const width = useSharedValue(0);
  const translateX = useSharedValue(0);
  const layouts = useRef(Array.from({ length: routes.length }, () => ({ width: 0, x: 0 })));

  const animatedStyles = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
    transform: [{ translateX: translateX.value }]
  }));

  useEffect(() => {
    width.value = withTiming(layouts.current[index].width);
    translateX.value = withSpring(layouts.current[index].x, {
      mass: 1,
      damping: 22,
      stiffness: 270,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
      reduceMotion: ReduceMotion.System,
    })
  }, [index]);

  const renderTabBar = (props: SceneRendererProps & {
    navigationState: NavigationState<{ key: string; title: string; }>
  }) => (
    <>
      <Box style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => (
          <TouchableOpacity
            key={route.key}
            onLayout={({ nativeEvent }) => {
              layouts.current[i] = {
                width: nativeEvent.layout.width + 24,
                x: nativeEvent.layout.x + 14,
              }
              if (i === 0) {
                width.value = nativeEvent.layout.width + 24;
                translateX.value = nativeEvent.layout.x + 14;
                height.value = nativeEvent.layout.height;
              }
            }}
            style={styles.tabItem}
            onPress={() => setIndex(i)}>
            <Animated.View >
              <Text color={i === props.navigationState.index ? 'mainText' : 'mainText'}>
                {route.title}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        ))}
      </Box>
      <Seperator variant='m' />
    </>
  );

  return (
    <>
      <Box variant='header'>
        <Header>Profile</Header>
      </Box>
      <View style={styles.draggableArea}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
        />
        <Animated.View style={[animatedStyles, styles.tabNavPillContainer]}>
          <Box
            style={styles.tabNavPill}
            backgroundColor='tabNavPill'
            borderColor='tabNavPillBorder'
            borderWidth={1.5}
          />
        </Animated.View>
      </View>
    </>
  );
}
