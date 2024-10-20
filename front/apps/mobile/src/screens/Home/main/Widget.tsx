import { useEffect } from 'react';
import { TouchableHighlight } from 'react-native';
import { useTheme } from '@shopify/restyle';

import styles from './styles/widget';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  useAnimatedReaction,
  withTiming,
  withDelay
} from "react-native-reanimated";
import { Box, defaultSpringConfig } from '@ledget/native-ui';
import { getAbsPosition, animationConfig } from './helpers';
import type { WidgetProps } from './types';
import { widgetsMap } from "./widgetsMap";
import { gap } from './constants';

const Widget = (props: WidgetProps) => {
  const WidgetComponent = widgetsMap[props.widget.type];
  const theme = useTheme();

  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const shadowOpacity = useSharedValue(0)
  const isGestureActive = useSharedValue(0)
  const opacity = useSharedValue(0)
  const scale = useSharedValue(.5)

  useEffect(() => {
    opacity.value = withTiming(props.visible ? 1 : 0, animationConfig);
  }, [props.visible]);

  useEffect(() => {
    if (!props.visible) return;

    const pos = getAbsPosition(
      props.positions.value[props.widget.id || props.widget.type],
      props.height
    );
    translateX.value = pos.x;
    translateY.value = pos.y;
  }, [props.visible]);

  useAnimatedReaction(() => props.positions, (newOrder) => {
    if (!isGestureActive.value) {
      const pos = getAbsPosition(
        newOrder.value[props.widget.id || props.widget.type],
        props.height
      );
      translateX.value = withTiming(pos.x, animationConfig);
      translateY.value = withTiming(pos.y, animationConfig);
    }
  }, [props.positions.value]);

  useAnimatedReaction(() => props.positions,
    (newOrder) => {
      if (!isGestureActive.value) {
        const pos = getAbsPosition(
          props.positions.value[props.widget.id || props.widget.type],
          props.height
        );
        translateX.value = withTiming(pos.x, animationConfig);
        translateY.value = withTiming(pos.y, animationConfig);
      }
    }
  );

  useEffect(() => {
    if (props.visible) {
      scale.value = withDelay(props.index * 50, withSpring(1, defaultSpringConfig));
      opacity.value = withDelay(props.index * 50, withTiming(1, defaultSpringConfig));
    } else {
      scale.value = withDelay(500, withSpring(.5, defaultSpringConfig));
      opacity.value = withTiming(0, defaultSpringConfig);
    }
  }, [props.visible]);

  const style = useAnimatedStyle(() => {
    const zIndex = isGestureActive.value ? 100 : 0;
    return {
      position: "absolute",
      top: 0,
      left: 0,
      width: props.widget.shape === 'rectangle' ? (props.height * 2) + gap : props.height,
      height: props.height,
      opacity: opacity.value,
      zIndex,
      shadowColor: "#000",
      shadowOpacity: shadowOpacity.value,
      shadowRadius: 12,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <Animated.View style={style}>
      <Box
        style={styles.filled}
        shadowColor='navShadow'
        shadowOpacity={theme.colors.mode === 'dark' ? 0 : .2}
        shadowRadius={12}
        shadowOffset={{ width: 0, height: 2 }}
      >
        <Box
          style={styles.filled}
          shadowColor='navShadow'
          shadowOpacity={.3}
          shadowRadius={2}
          shadowOffset={{ width: 0, height: 2 }}
        >
          <Box style={[styles.filled, styles.clipBox]} borderRadius='xl'>
            <TouchableHighlight
              underlayColor={theme.colors.mainText}
              activeOpacity={.97}
              style={[styles.filled, styles.button]}
              onPress={() => { console.log('pressed') }}
            >
              <Box
                backgroundColor='nestedContainer'
                borderRadius='xl'
                paddingHorizontal='nestedContainerHPadding'
                paddingVertical='nestedContainerVPadding'
                style={styles.filled}
              >
                <WidgetComponent {...props.widget.args} />
              </Box>
            </TouchableHighlight>
          </Box>
        </Box>
      </Box>
    </Animated.View>
  )
}

export default Widget;
