import { View, Image, Pressable } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Canvas, Rect, LinearGradient, vec } from '@shopify/react-native-skia';
import Animated, {
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Big from 'big.js';

import styles from './styles/card';
import { Account } from '@ledget/shared-features';
import { Box, defaultSpringConfig, DollarCents, Text } from '@ledget/native-ui';
import { useGetPlaidItemsQuery } from '@ledget/shared-features';
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
  const { data: plaidItemsData } = useGetPlaidItemsQuery();
  const { size = 'regular' } = props;
  const buttonScale = useSharedValue(1);
  const cardHue =
    typeof props.hue === 'number' ? useSharedValue(props.hue) : props.hue;

  const gradientColors = useDerivedValue(() => [
    theme.colors.creditCardGradientStart.replace(
      theme.colors.blueHue,
      cardHue?.value || props.account?.cardHue || theme.colors.blueHue
    ),
    theme.colors.creditCardGradientEnd.replace(
      theme.colors.blueHue,
      cardHue?.value || props.account?.cardHue || theme.colors.blueHue
    ),
  ]);

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
        <View style={styles.cardContainer}>
          <Canvas style={styles.cardBack}>
            <Rect x={0} y={0} width={width} height={height}>
              <LinearGradient
                colors={gradientColors}
                start={vec(width * 1.5, 0)}
                end={vec(width / 2, height / 2)}
              />
            </Rect>
          </Canvas>
          {!props.empty && (
            <>
              <Box
                borderRadius={'l'}
                style={[styles.card, (styles as any)[size + 'CardPadding']]}
              >
                <Box
                  shadowColor={'logoShadow'}
                  shadowOffset={{ width: 0, height: 1 }}
                  shadowOpacity={0.1}
                  shadowRadius={1}
                  style={styles.logo}
                >
                  <Image
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                    source={{
                      uri: `data:image/png;base64,${
                        plaidItemsData?.find((p) =>
                          p.accounts.find(
                            (account) => account.id === props.account?.id
                          )
                        )?.institution?.logo
                      }`,
                    }}
                  />
                </Box>
                <View style={styles.cardTopHalf}>
                  <DollarCents
                    color="whiteText"
                    variant="bold"
                    fontSize={size === 'regular' ? 18 : 16}
                    value={Big(props.account?.balances.current || 0)
                      .times(100)
                      .toNumber()}
                  />
                  <Text
                    style={styles.accountName}
                    fontSize={size === 'regular' ? 16 : 14}
                    color="whiteText"
                  >
                    {(props.account?.name.length || 0) > 20
                      ? props.account?.name.slice(0, 20) + '...'
                      : props.account?.name}
                  </Text>
                </View>
                <View style={styles.mask}>
                  <Text fontSize={13} color="whiteText" variant="bold">
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
                borderTopWidth={1.5}
                style={styles.bottomStripe}
              />
            </>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};
