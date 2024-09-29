import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useTheme } from "@shopify/restyle";
import { Canvas, Rect, vec, LinearGradient, interpolate } from '@shopify/react-native-skia';
import { ChevronDown } from "geist-native-icons";
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import {
  useSharedValue,
  SharedValue,
  useDerivedValue,
  useAnimatedReaction,
  runOnJS
} from "react-native-reanimated";

import styles from './styles/hue-slider';
import { Box, Icon } from "@ledget/native-ui";
import { Card } from "./Card";
import { useUpdateAccountsMutation } from "@ledget/shared-features";

interface SliderProps { hue: SharedValue<number>, width: number, onChange: (val: number) => void }

const Slider = (props: SliderProps) => {
  const gradientColors = useDerivedValue(() => {
    return Array.from({ length: 180 }, (_, i) => {
      const intHue = Number(props.hue.value);
      const iHue = interpolate(i, [0, 180], [intHue - 90, intHue + 90]);
      return `hsl(${iHue}, 50%, 50%)`;
    })
  });

  const pan = Gesture.Pan()
    .onChange(({ translationX, changeX }) => {
      props.hue.value = Math.round(props.hue.value - changeX) % 360;
    })
    .onEnd(() => {
      runOnJS(props.onChange)(props.hue.value);
    });

  return (
    <GestureDetector gesture={pan}>
      <View style={styles.sliderContainer}>
        <View style={styles.chevronIconContainer}>
          <View style={[styles.colorIndicator]} />
          <View style={styles.chevronIcon}>
            <Icon
              icon={ChevronDown}
              color='whiteText'
              borderColor='whiteText'
              strokeWidth={3.5}
              size={20}
            />
          </View>
        </View>
        <Box
          borderWidth={1.75}
          borderColor='whiteText'
          style={styles.slider}
        >
          <Canvas style={styles.canvas}>
            <Rect x={0} y={0} width={180} height={30}>
              <LinearGradient
                colors={gradientColors}
                start={vec(0, 0)}
                end={vec(props.width, 0)}
              />
            </Rect>
          </Canvas>
        </Box>
      </View>
    </GestureDetector>
  )
}

export const HueSliderCard = (props: { account: string, onChange: (val: number) => void, hue?: number }) => {
  const [size, setSize] = useState<{ width: number; height: number }>();
  const ref = useRef<View>(null);
  const [updateAccount] = useUpdateAccountsMutation();
  const theme = useTheme();
  const hue = useSharedValue(props.hue || theme.colors.blueHue);

  useEffect(() => {
    ref.current?.measure((x, y, width, height) => {
      setSize({ width, height })
    });
  }, []);

  useEffect(() => {
    ref.current?.measure((x, y, width, height) => {
      setSize({ width, height });
    });
  }, []);

  const handleChangedHue = (newValue: number) => {
    props.onChange(newValue);
    updateAccount([{ account: props.account, cardHue: newValue }]);
  }

  return (
    <Box style={[styles.container, { height: size?.height }]}>
      {size?.width &&
        <Slider hue={hue} width={size.width} onChange={handleChangedHue} />}
      <View ref={ref}>
        <Card empty hue={hue} />
      </View>
    </Box>
  );
};


export default HueSliderCard;
