import { useEffect, useState } from "react";
import {
  View,
  ViewStyle,
  PanResponder,
  Dimensions,
  TouchableHighlight
} from "react-native";
import { Check } from "geist-native-icons";
import dayjs from "dayjs";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import * as Haptics from 'expo-haptics';
import OutsidePressHandler from "react-native-outside-press";

import styles from './styles/item'
import {
  Box,
  InstitutionLogo,
  Text,
  DollarCents,
  defaultSpringConfig,
  Icon,
  BillCatLabel
} from "@ledget/native-ui";
import { formatDateOrRelativeDate } from '@ledget/helpers';
import { useAppDispatch } from "@/hooks";
import {
  Transaction,
  useGetPlaidItemsQuery,
  confirmAndUpdateMetaData
} from "@ledget/shared-features";
import { useAppearance } from "@/features/appearanceSlice";
import { useTheme } from "@shopify/restyle";

interface Props {
  item: Transaction
  style?: ViewStyle
  contentStyle?: ViewStyle
  expandable?: boolean
  focused?: boolean
  setFocused?: React.Dispatch<React.SetStateAction<string | undefined>>
}

const SWIPE_THRESHOLD = Dimensions.get('window').width / 3;
const SWIPE_VELOCITY_THRESHOLD = 1.5;

const Item = (props: Props) => {
  const {
    item,
    style,
    contentStyle,
    expandable,
    focused: propsFocused,
    setFocused: propsSetFocused
  } = props;

  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { data: plaidItemsData } = useGetPlaidItemsQuery();
  const [focused, setFocused] = useState(false);

  const { mode } = useAppearance();
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const paddingVertical = useSharedValue(0);
  const leftCheckX = useSharedValue(24);
  const rightCheckX = useSharedValue(24);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gs) => false,
    onStartShouldSetPanResponderCapture: (evt, gs) => false,
    onMoveShouldSetPanResponder: (evt, gs) => Math.abs(gs.vx) > Math.abs(gs.vy),
    onMoveShouldSetPanResponderCapture: (evt, gs) => false,
    onShouldBlockNativeResponder: () => false,
    onPanResponderMove: (event, gs) => {
      x.value = gs.dx;
      if (gs.dx > 0) {
        leftCheckX.value = Math.pow(gs.dx, 0.75) * -1.5;
      } else {
        rightCheckX.value = Math.pow(Math.abs(gs.dx), 0.75) * -1.5;
      }
    },
    onPanResponderTerminate: (evt, gs) => {
      if (Math.abs(gs.dx) > SWIPE_THRESHOLD || Math.abs(gs.vx) > SWIPE_VELOCITY_THRESHOLD) {
        x.value = withSpring(Dimensions.get('window').width * Math.sign(gs.dx), defaultSpringConfig);
        opacity.value = withSpring(0, defaultSpringConfig);
        setTimeout(() => {
          dispatch(confirmAndUpdateMetaData(item));
        }, 100);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        x.value = withTiming(0, defaultSpringConfig);
        leftCheckX.value = withTiming(0, defaultSpringConfig);
        rightCheckX.value = withTiming(0, defaultSpringConfig);
      }
    },
    onPanResponderRelease: (evt, gs) => {
      if (Math.abs(gs.dx) > SWIPE_THRESHOLD || Math.abs(gs.vx) > SWIPE_VELOCITY_THRESHOLD) {
        x.value = withSpring(Dimensions.get('window').width * Math.sign(gs.dx), defaultSpringConfig);
        opacity.value = withSpring(0, defaultSpringConfig);
        setTimeout(() => {
          dispatch(confirmAndUpdateMetaData(item));
        }, 100);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        x.value = withTiming(0, defaultSpringConfig);
        leftCheckX.value = withTiming(24, defaultSpringConfig);
        rightCheckX.value = withTiming(24, defaultSpringConfig);
      }
    }
  });

  const buttonAnimation = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateX: x.value }, { translateY: y.value }, { scale: scale.value }],
    }
  });

  useEffect(() => {
    if (focused) {
      propsSetFocused && propsSetFocused(item.transaction_id);
      paddingVertical.value = withTiming(16, { duration: 200 });
      y.value = withTiming(-2, { duration: 200 });
      scale.value = withTiming(1.05, { duration: 200 });
    } else {
      propsSetFocused && propsSetFocused(undefined);
      paddingVertical.value = withTiming(0, { duration: 200 });
      y.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(1, { duration: 200 });
    }
  }, [focused]);

  return (
    <OutsidePressHandler onOutsidePress={() => setFocused(false)}>
      <View {...panResponder.panHandlers}>
        <Animated.View style={[buttonAnimation, styles.container]}>
          <Animated.View style={[styles.leftCheckContainer, { left: leftCheckX }]}>
            <Icon
              icon={Check}
              size={24}
              strokeWidth={2}
              color={mode === 'light' ? 'tertiaryText' : 'mainText'}
            />
          </Animated.View>
          <Box
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
            <TouchableHighlight
              underlayColor={theme.colors.newTransactionBorder}
              activeOpacity={.98}
              disabled={!expandable}
              onLongPress={() => {
                if (!expandable) return;
                setFocused(true);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              }}
              style={styles.touchable}>
              <Animated.View style={[styles.content, contentStyle]}>
                <View style={styles.leftColumn}>
                  <InstitutionLogo data={
                    plaidItemsData?.find((p) =>
                      p.accounts.find((account) => account.id === item.account)
                    )?.institution?.logo
                  } />
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionName}>
                      {focused
                        ? item.name.length > 32 ? `${item.name.slice(0, 32)} ...` : item.name
                        : item.name.length > 17 ? `${item.name.slice(0, 17)} ...` : item.name
                      }
                    </Text>
                    <View style={styles.bottomRow}>
                      <DollarCents value={item.amount} color='secondaryText' fontSize={15} />
                      <Text color='secondaryText' fontSize={14}>
                        {formatDateOrRelativeDate(dayjs(item.datetime! || item.date).valueOf())}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.rightColumn}>
                  <View style={[styles.billCatLabelContainer, { opacity: focused ? .2 : 1 }]}>
                    <BillCatLabel
                      name={
                        item.categories?.[0]?.name ||
                        item.bill?.name ||
                        item?.predicted_category?.name ||
                        item.predicted_bill?.name ||
                        'Uncategorized'
                      }
                      emoji={
                        item.categories?.[0]?.emoji ||
                        item.bill?.emoji ||
                        item?.predicted_category?.emoji ||
                        item.predicted_bill?.emoji ||
                        null
                      }
                      period={
                        item.categories?.[0]?.period ||
                        item.bill?.period ||
                        item?.predicted_category?.period ||
                        item.predicted_bill?.period ||
                        'month'
                      } />
                  </View>
                </View>
              </Animated.View>
            </TouchableHighlight>
          </Box>
          <Animated.View style={[styles.rightCheckContainer, { right: rightCheckX }]}>
            <Icon
              icon={Check}
              size={24}
              strokeWidth={2}
              color={mode === 'light' ? 'tertiaryText' : 'mainText'}
            />
          </Animated.View>
        </Animated.View>
      </View>
    </OutsidePressHandler>
  )
}

export default Item;
