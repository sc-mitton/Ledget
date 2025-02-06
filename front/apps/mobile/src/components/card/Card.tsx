import { useMemo } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import {
  Canvas,
  Rect,
  vec,
  RadialGradient,
  LinearGradient,
} from '@shopify/react-native-skia';
import Animated, {
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Grayscale } from 'react-native-color-matrix-image-filters';
import Big from 'big.js';

import styles from './styles/card';
import { Account } from '@ledget/shared-features';
import {
  Box,
  defaultSpringConfig,
  DollarCents,
  Text,
  InstitutionLogo,
} from '@ledget/native-ui';
import { useAppearance } from '@/features/appearanceSlice';
import { CARD_WIDTH, CARD_HEIGHT } from './constants';

interface Props {
  account?: Account;
  onPress?: () => void;
  onLongPress?: () => void;
  skeleton?: boolean;
  size?: 'small' | 'regular';
  hue?: SharedValue<number | undefined> | number;
  empty?: boolean;
}

export const Card = (props: Props) => {
  const theme = useTheme();
  const { mode } = useAppearance();
  const { size = 'regular' } = props;
  const buttonScale = useSharedValue(1);
  const cardHue =
    typeof props.hue === 'number' || typeof props.hue === 'string'
      ? useSharedValue(props.hue)
      : props.hue;

  const gradientColors = useDerivedValue(() => {
    const sat = mode === 'dark' ? 30 : 35;
    const lightRegex = /hsl\(\d+,\s*\d+%,\s*(\d+)%\)/;
    const defaultLightnessStart = parseInt(
      theme.colors.creditCardDefaultGradientStart.match(lightRegex)?.[1]
    );
    const defaultLightnessEnd = parseInt(
      theme.colors.creditCardDefaultGradientEnd.match(lightRegex)?.[1]
    );
    const lightnessStart =
      mode === 'dark' ? defaultLightnessStart + 20 : defaultLightnessStart;
    const lightnessEnd =
      mode === 'dark' ? defaultLightnessEnd + 20 : defaultLightnessEnd;

    const start = cardHue?.value
      ? `hsl(${cardHue.value}, ${sat}%, ${lightnessStart}%)`
      : theme.colors.creditCardDefaultGradientStart;
    const end = cardHue?.value
      ? `hsl(${cardHue.value}, ${sat}%, ${lightnessEnd}%)`
      : theme.colors.creditCardDefaultGradientEnd;

    return [start, end];
  });

  const borderColor = useMemo(() => {
    if (!props.account?.card_hue) return theme.colors.creditCardDefaultBorder;

    const sat = mode === 'dark' ? 30 : 35;

    const lightRegex = /hsl\(\d+,\s*\d+%,\s*(\d+)%\)/;
    const defaultLightnessStart = parseInt(
      theme.colors.creditCardDefaultGradientStart.match(lightRegex)?.[1]
    );
    const defaultLightnessEnd = parseInt(
      theme.colors.creditCardDefaultGradientEnd.match(lightRegex)?.[1]
    );

    const customGradientEndLight = defaultLightnessEnd;
    const customGradientStartDark = defaultLightnessStart + 20;

    const borderLightness =
      mode === 'dark' ? customGradientStartDark : customGradientEndLight;

    return `hsl(${props.account.card_hue}, ${sat}%, ${borderLightness}%)`;
  }, [mode]);

  const width = size === 'regular' ? CARD_WIDTH : 155;
  const height =
    size === 'regular' ? CARD_HEIGHT : width * (CARD_HEIGHT / CARD_WIDTH);

  return (
    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
      <Pressable
        style={[styles.pressable, { width, height }]}
        disabled={props.skeleton || props.empty}
        onPressIn={() => {
          buttonScale.value = withSpring(0.97, defaultSpringConfig);
        }}
        onPressOut={() => {
          buttonScale.value = withSpring(1, defaultSpringConfig);
        }}
        onPress={props.onPress}
        onLongPress={props.onLongPress}
      >
        <Box style={styles.cardContainer}>
          <Animated.View style={[styles.cardBorder, { borderColor }]} />
          <Canvas style={[styles.cardBack, styles.cardBack1]}>
            <Rect x={0} y={0} width={width} height={height}>
              <RadialGradient
                colors={gradientColors}
                c={vec(0, 0)}
                r={height}
              />
            </Rect>
          </Canvas>
          <Canvas style={[styles.cardBack, styles.cardBack2]}>
            <Rect x={0} y={0} width={width} height={height}>
              <RadialGradient
                colors={gradientColors}
                c={vec(width * 0.4, height * 0.2)}
                r={height / 1.7}
              />
            </Rect>
          </Canvas>
          {!props.empty && (
            <>
              <Box
                borderRadius={'l'}
                style={[styles.card, (styles as any)[size + 'CardPadding']]}
              >
                <View style={styles.logo}>
                  <Grayscale>
                    <InstitutionLogo account={props.account?.id} />
                  </Grayscale>
                </View>
                <View style={styles.cardTopHalf}>
                  <DollarCents
                    color="whiteText"
                    variant="bold"
                    fontSize={size === 'regular' ? 18 : 14}
                    value={Big(props.account?.balances.current || 0)
                      .times(100)
                      .toNumber()}
                  />
                  <Text
                    style={styles.accountName}
                    fontSize={size === 'regular' ? 14 : 12}
                    color="whiteText"
                  >
                    {(props.account?.name.length || 0) > 20
                      ? props.account?.name.slice(0, 20) + '...'
                      : props.account?.name}
                  </Text>
                </View>
                {size !== 'small' && (
                  <View style={styles.chipContainer}>
                    <Canvas style={[{ width: 22, height: 16 }, styles.chip]}>
                      <Rect x={0} y={0} width={22} height={16}>
                        <LinearGradient
                          colors={gradientColors}
                          start={vec(0, 0)}
                          end={vec(16, 22)}
                        />
                      </Rect>
                    </Canvas>
                    <Box
                      style={[StyleSheet.absoluteFill, styles.chipBack]}
                      backgroundColor="whiteText"
                    />
                  </View>
                )}
                <View
                  style={[styles.mask, size === 'small' && styles.smallMask]}
                >
                  <Text
                    fontSize={size === 'small' ? 12 : 13}
                    color="whiteText"
                    variant="bold"
                  >
                    &bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;
                    &nbsp;&nbsp;
                    &bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;
                    &nbsp;&nbsp;
                    {props.account?.mask.split('').slice(-4).join(' ')}
                  </Text>
                </View>
              </Box>
              <Box
                borderTopColor="whiteText"
                backgroundColor="secondaryText"
                borderTopWidth={1.5}
                style={styles.bottomStripe}
              />
            </>
          )}
        </Box>
      </Pressable>
    </Animated.View>
  );
};
