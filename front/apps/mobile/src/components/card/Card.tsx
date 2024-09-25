import { View, Image, Pressable } from 'react-native';
import { useTheme } from '@shopify/restyle';
import {
  Canvas,
  Rect,
  TwoPointConicalGradient,
  LinearGradient,
  vec
} from "@shopify/react-native-skia";
import Animated, { SharedValue, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';

import styles from './styles/card';
import { Account } from "@ledget/shared-features";
import { Box, defaultSpringConfig, DollarCents, Text } from "@ledget/native-ui";
import { useGetPlaidItemsQuery } from "@ledget/shared-features";
import { useAppearance } from '@/features/appearanceSlice';
import { CARD_WIDTH, CARD_HEIGHT } from './constants';

interface Props {
  account?: Account;
  onPress?: () => void;
  onLongPress?: () => void;
  skeleton?: boolean;
  size?: 'small' | 'regular'
  hasShadow?: boolean
  hue?: SharedValue<number>
  empty?: boolean
}

export const Card = (props: Props) => {
  const theme = useTheme();
  const { mode } = useAppearance();
  const { data: plaidItemsData } = useGetPlaidItemsQuery();
  const { size = 'regular', hasShadow = true } = props;
  const buttonScale = useSharedValue(1);

  const gradientColors = useDerivedValue(() => [
    theme.colors.creditCardGradientStart.replace(theme.colors.blueHue,
      props.hue?.value || props.account?.cardHue || theme.colors.blueHue
    ),
    theme.colors.creditCardGradientEnd.replace(theme.colors.blueHue,
      props.hue?.value || props.account?.cardHue || theme.colors.blueHue
    )
  ]);

  const gradientEdgeColors = useDerivedValue(() => [
    theme.colors.creditCardBorderStop.replace(theme.colors.blueHue,
      props.hue?.value || props.account?.cardHue || theme.colors.blueHue
    ),
    theme.colors.creditCardBorderStart.replace(theme.colors.blueHue,
      props.hue?.value || props.account?.cardHue || theme.colors.blueHue
    )
  ]);

  const width = size === 'regular' ? CARD_WIDTH : 155
  const height = size === 'regular'
    ? CARD_HEIGHT
    : width * (CARD_HEIGHT / CARD_WIDTH)

  return (
    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
      <Box
        shadowColor={hasShadow ? 'creditCardShadow' : 'transparent'}
        shadowOpacity={mode === 'dark' ? 1 : .7}
        shadowRadius={mode === 'dark' ? 12 : 7}
        shadowOffset={{ width: 0, height: 12 }}
        elevation={7}
        style={props.skeleton || props.empty
          ? styles.skeletonCardTouchableContainer
          : styles[`${size}TouchableContainer`]
        }
      >
        <Canvas style={[styles.cardBorder, (styles as any)[size + 'CardBorder']]}>
          <Rect x={0} y={0} width={width * 1.3} height={height * 1.3}>
            <TwoPointConicalGradient
              start={vec(
                props.size === 'regular'
                  ? width / 2
                  : (width / 2) / (CARD_WIDTH / CARD_HEIGHT),
                props.size === 'regular'
                  ? height / 2
                  : (height / 10) / (CARD_WIDTH / CARD_HEIGHT),
              )}
              startR={props.size === 'regular' ? width : width / 2}
              end={vec(0, 0)}
              endR={30}
              colors={gradientEdgeColors}
            />
          </Rect>
        </Canvas>
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
          <View style={styles.cardContainer}>
            <Canvas style={styles.cardBack}>
              <Rect x={0} y={0} width={width} height={height}>
                <LinearGradient
                  colors={gradientColors}
                  start={vec(0, 0)}
                  end={vec(0, height)}
                />
              </Rect>
            </Canvas>
            {!props.empty &&
              <>
                <Box borderRadius={12} style={[styles.card, (styles as any)[size + 'CardPadding']]}>
                  <Box
                    shadowColor={'logoShadow'}
                    shadowOffset={{ width: 0, height: 1 }}
                    shadowOpacity={.1}
                    shadowRadius={1}
                    style={styles.logo}>
                    <Image
                      style={{ width: 20, height: 20 }}
                      resizeMode='contain'
                      source={{
                        uri: `data:image/png;base64,${plaidItemsData?.find((p) =>
                          p.accounts.find((account) => account.id === props.account?.id))?.institution?.logo
                          }`
                      }}
                    />
                  </Box>
                  <View>
                    <Text
                      fontSize={size === 'regular' ? 16 : 14}
                      color='whiteText'>
                      {(props.account?.name.length || 0) > 16
                        ? props.account?.name.slice(0, 16) + '...'
                        : props.account?.name}
                    </Text>
                    <DollarCents
                      color='whiteText'
                      fontSize={size === 'regular' ? 18 : 16}
                      value={props.account?.balances.current || 0} />
                  </View>
                  <View style={styles.mask}>
                    <Text fontSize={13} color='whiteText' variant='bold'>
                      &bull;&nbsp;&bull;&nbsp;&bull;&nbsp;&bull;&nbsp;
                      &nbsp;&nbsp;
                      {props.account?.mask.split('').slice(-4).join(' ')}
                    </Text>
                  </View>
                </Box >
                <Box
                  borderTopColor='whiteText'
                  borderTopWidth={1.5}
                  style={styles.bottomStripe}
                />
              </>}
          </View>
        </Pressable>
      </Box>
    </Animated.View>
  )
}
