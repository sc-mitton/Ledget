import { useState } from "react";
import { View, ViewStyle, PanResponder, Dimensions } from "react-native";
import dayjs from "dayjs";
import Animated, { useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import * as Haptics from 'expo-haptics';
import { Check } from "geist-native-icons";

import styles from './styles/item'
import {
  Box,
  InstitutionLogo,
  Text,
  DollarCents,
  defaultSpringConfig,
  Icon
} from "@ledget/native-ui";
import { formatDateOrRelativeDate } from '@ledget/helpers';
import { useAppDispatch } from "@/hooks";
import {
  Transaction,
  useGetPlaidItemsQuery,
  SplitCategory,
  confirmAndUpdateMetaData
} from "@ledget/shared-features";
import { useAppearance } from "@/features/appearanceSlice";

interface Props {
  item: Transaction
  style?: ViewStyle
  contentStyle?: ViewStyle
}

const SWIPE_THRESHOLD = Dimensions.get('window').width / 3;
const SWIPE_VELOCITY_THRESHOLD = 1.5;

const Item = ({ item, style, contentStyle }: Props) => {
  const dispatch = useAppDispatch();
  const { data: plaidItemsData } = useGetPlaidItemsQuery();

  const { mode } = useAppearance();
  const [updatedCategories, setUpdatedCategories] = useState<SplitCategory[]>([]);
  const [updatedBill, setUpdatedBill] = useState<string | undefined>(undefined);
  const x = useSharedValue(0);
  const leftCheckX = useSharedValue(-36);
  const rightCheckX = useSharedValue(-36);
  const opacity = useSharedValue(1);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gs) => false,
    onStartShouldSetPanResponderCapture: (evt, gs) => false,
    onMoveShouldSetPanResponder: (evt, gs) => Math.abs(gs.vx) > Math.abs(gs.vy),
    onMoveShouldSetPanResponderCapture: (evt, gs) => false,
    onShouldBlockNativeResponder: () => false,
    onPanResponderMove: (event, gs) => {
      x.value = gs.dx;
      if (gs.dx > 0) {
        leftCheckX.value = Math.pow(gs.dx, 0.75) * -1 - 32;
      } else {
        rightCheckX.value = Math.pow(Math.abs(gs.dx), 0.75) * -1 - 32;
      }
    },
    onPanResponderRelease: (evt, gs) => {
      if (Math.abs(gs.dx) > SWIPE_THRESHOLD || Math.abs(gs.vx) > SWIPE_VELOCITY_THRESHOLD) {
        x.value = withSpring(Dimensions.get('window').width * Math.sign(gs.dx), defaultSpringConfig);
        opacity.value = withSpring(0, defaultSpringConfig);
        setTimeout(() => {
          dispatch(confirmAndUpdateMetaData({
            transaction: item,
            categories: updatedCategories
              ? updatedCategories
              : item?.predicted_category ? [{ ...item.predicted_category, fraction: 1 }] : undefined,
            bill: updatedBill ? updatedBill : item.predicted_bill?.id
          }));
        }, 100);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        x.value = withTiming(0, defaultSpringConfig);
        leftCheckX.value = withTiming(-36, defaultSpringConfig);
        rightCheckX.value = withTiming(-36, defaultSpringConfig);
      }
    }
  });

  return (
    <View {...panResponder.panHandlers}>
      <Animated.View style={[{ transform: [{ translateX: x }], opacity }, styles.container]}>
        <Animated.View style={[styles.leftCheckContainer, { left: leftCheckX }]}>
          <Icon icon={Check} size={24} strokeWidth={2} color='tertiaryText' />
        </Animated.View>
        <Box
          paddingHorizontal='l'
          paddingVertical="m"
          borderRadius={14}
          backgroundColor='newTransaction'
          shadowColor='newTransactionShadow'
          borderColor='newTransactionBorder'
          borderWidth={1}
          shadowOpacity={mode === 'dark' ? 1 : 0.5}
          shadowRadius={32}
          shadowOffset={{ width: 0, height: 4 }}
          style={style}
        >
          <View style={[styles.content, contentStyle]}>
            <View style={styles.leftColumn}>
              <InstitutionLogo data={
                plaidItemsData?.find((p) =>
                  p.accounts.find((account) => account.id === item.account)
                )?.institution?.logo
              } />
              <View>
                <Text>
                  {item.name.length > 20
                    ? `${item.name.slice(0, 20)} ...`
                    : item.name}
                </Text>
                <View style={styles.bottomRow}>
                  <DollarCents value={item.amount} color='secondaryText' />
                  <Text color='secondaryText' fontSize={14}>
                    {formatDateOrRelativeDate(dayjs(item.datetime! || item.date).valueOf())}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Box>
        <Animated.View style={[styles.rightCheckContainer, { right: rightCheckX }]}>
          <Icon icon={Check} size={24} strokeWidth={2} color='tertiaryText' />
        </Animated.View>
      </Animated.View>
    </View>
  )
}

export default Item;
