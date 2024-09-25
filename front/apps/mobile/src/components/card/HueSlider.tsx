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

const Slider = ({ hue, width }: { hue: SharedValue<number>, width: number }) => {
  const gradientColors = useDerivedValue(() => {
    return Array.from({ length: 180 }, (_, i) => {
      const intHue = Number(hue.value);
      const iHue = interpolate(i, [0, 180], [intHue - 90, intHue + 90]);
      return `hsl(${iHue}, 50%, 50%)`;
    })
  });

  const pan = Gesture.Pan().onChange(({ translationX, changeX }) => {
    hue.value = Math.round(hue.value - changeX) % 360;
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
                end={vec(width, 0)}
              />
            </Rect>
          </Canvas>
        </Box>
      </View>
    </GestureDetector>
  )
}

export const HueSliderCard = ({ account, onTimeout }: { account: string; onTimeout?: () => void }) => {
  const [size, setSize] = useState<{ width: number; height: number }>();
  const ref = useRef<View>(null);
  const [updateAccount] = useUpdateAccountsMutation();
  const theme = useTheme();
  const hue = useSharedValue(theme.colors.blueHue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    // Clear the previous timeout if hue.value changes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout to trigger the updateAccount request after 3 seconds
    timeoutRef.current = setTimeout(() => {
      updateAccount([{ account: account, hue: newValue }]);
    }, 3000);
  }

  useAnimatedReaction(
    () => hue.value,
    (newValue) => { runOnJS(handleChangedHue)(newValue) }
  );

  return (
    <Box style={[styles.container, { height: size?.height }]}>
      {size?.width && <Slider hue={hue} width={size.width} />}
      <View ref={ref}>
        <Card empty hue={hue} />
      </View>
    </Box>
  );
};


export default HueSliderCard;
