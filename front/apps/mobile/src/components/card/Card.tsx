import { View, Image, TouchableHighlight, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Canvas,
  Rect,
  TwoPointConicalGradient,
  vec
} from "@shopify/react-native-skia";

import styles from './styles';
import { Account } from "@ledget/shared-features";
import { Box, DollarCents, Text } from "@ledget/native-ui";
import { useGetPlaidItemsQuery } from "@ledget/shared-features";
import { useAppearance } from '@/features/appearanceSlice';
import { CARD_WIDTH, CARD_HEIGHT } from './constants';

export const Card = (props: { account?: Account, onPress?: () => void, skeleton?: boolean }) => {
  const theme = useTheme();
  const { mode } = useAppearance();
  const { data: plaidItemsData } = useGetPlaidItemsQuery();

  return (
    <Box
      shadowColor='creditCardShadow'
      shadowOpacity={mode === 'dark' ? 1 : .7}
      shadowRadius={mode === 'dark' ? 12 : 7}
      shadowOffset={{ width: 0, height: 12 }}
      elevation={7}
      style={props.skeleton ? styles.skeletonCardTouchableContainer : styles.touchableContanier}
    >
      <View style={styles.cardBorder}>
        <Canvas style={{ flex: 1 }}>
          <Rect x={0} y={0} width={256} height={256}>
            <TwoPointConicalGradient
              start={vec(CARD_WIDTH / 2, CARD_HEIGHT / 2)}
              startR={120}
              end={vec(0, CARD_HEIGHT / 5)}
              endR={30}
              colors={[
                theme.colors.creditCardBorderStart,
                theme.colors.creditCardBorderStop,
              ]}
            />
          </Rect>
        </Canvas>
      </View>
      <TouchableHighlight
        style={styles.touchable}
        activeOpacity={.97}
        underlayColor={theme.colors?.mainText}
        onPress={props.onPress}
      >
        <View style={styles.cardContainer}>
          <LinearGradient
            style={StyleSheet.absoluteFill}
            colors={[
              theme.colors.creditCardGradientStart,
              theme.colors.creditCardGradientEnd,
            ]}
            start={[0, 0]}
            end={[1, 1]}
          />
          <Box borderRadius={12} style={styles.card}>
            <Box
              shadowColor="mainText"
              shadowOffset={{ width: 0, height: 1 }}
              shadowOpacity={.3}
              shadowRadius={1}
              style={styles.logo}>
              <Image
                style={{ width: 20, height: 20 }}
                resizeMode='contain'
                source={{
                  uri: `data:image/png;base64,${plaidItemsData?.find((p) =>
                    p.accounts.find((account) => account.id === props.account?.account_id))?.institution?.logo
                    }`
                }}
              />
            </Box>
            <View>
              <Text color='whiteText'>
                {(props.account?.name.length || 0) > 16
                  ? props.account?.name.slice(0, 16) + '...'
                  : props.account?.name}
              </Text>
              <DollarCents
                color='whiteText'
                fontSize={18}
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
        </View>
      </TouchableHighlight>
    </Box>
  )
}
