import { useEffect, useState } from 'react';
import {
  View,
  ViewStyle,
  PanResponder,
  Dimensions,
  Platform,
} from 'react-native';
import { Check } from 'geist-native-icons';
import dayjs from 'dayjs';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import styles from './styles/transaction-item';
import {
  Box,
  InstitutionLogo,
  Text,
  defaultSpringConfig,
  Icon,
  BillCatLabel,
} from '@ledget/native-ui';
import { formatDateOrRelativeDate } from '@ledget/helpers';
import { useAppDispatch } from '@/hooks';
import {
  Transaction,
  useGetPlaidItemsQuery,
  confirmAndUpdateMetaData,
} from '@ledget/shared-features';
import { useAppearance } from '@features/appearanceSlice';
import TransactionMenu from './TransactionMenu';

interface Props {
  item: Transaction;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  onShowMenu: (show: boolean) => void;
}

const SWIPE_THRESHOLD = Dimensions.get('window').width / 3;
const SWIPE_VELOCITY_THRESHOLD = 1.5;

const formater = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

const springConfig = {
  mass: 0.5,
  damping: 15,
  stiffness: 280,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.001,
};

const Item = (props: Props) => {
  const { item, style, contentStyle } = props;

  const dispatch = useAppDispatch();
  const { data: plaidItemsData } = useGetPlaidItemsQuery();
  const [focused, setFocused] = useState(false);

  const { mode } = useAppearance();
  const checkOpacity = useSharedValue(0);
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
      checkOpacity.value = 1;
      if (gs.dx > 0) {
        leftCheckX.value = gs.dx * -0.625;
      } else {
        rightCheckX.value = Math.pow(Math.abs(gs.dx), 0.75) * -1.5;
      }
    },
    onPanResponderTerminate: (evt, gs) => {
      checkOpacity.value = withTiming(0, { duration: 200 });
      if (
        Math.abs(gs.dx) > SWIPE_THRESHOLD ||
        Math.abs(gs.vx) > SWIPE_VELOCITY_THRESHOLD
      ) {
        x.value = withSpring(
          Dimensions.get('window').width * Math.sign(gs.dx),
          defaultSpringConfig
        );
        setTimeout(() => {
          dispatch(confirmAndUpdateMetaData(item));
        }, 100);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        x.value = withTiming(0, { duration: 200 });
        leftCheckX.value = withTiming(0, { duration: 200 });
        rightCheckX.value = withTiming(0, { duration: 200 });
      }
    },
    onPanResponderRelease: (evt, gs) => {
      checkOpacity.value = withTiming(0, { duration: 200 });
      if (
        Math.abs(gs.dx) > SWIPE_THRESHOLD ||
        Math.abs(gs.vx) > SWIPE_VELOCITY_THRESHOLD
      ) {
        x.value = withSpring(
          Dimensions.get('window').width * Math.sign(gs.dx),
          defaultSpringConfig
        );
        setTimeout(() => {
          dispatch(confirmAndUpdateMetaData(item));
        }, 100);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        x.value = withTiming(0, { duration: 200 });
        leftCheckX.value = withTiming(24, { duration: 200 });
        rightCheckX.value = withTiming(24, { duration: 200 });
      }
    },
  });

  const buttonAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: x.value },
        { scale: scale.value },
        { translateY: y.value },
      ],
    };
  });

  useEffect(() => {
    if (focused) {
      paddingVertical.value = withTiming(16, { duration: 200 });
      scale.value = withSpring(1.04, springConfig);
      y.value = withSpring(-4, springConfig);
    } else {
      paddingVertical.value = withTiming(0, { duration: 200 });
      scale.value = withSpring(1, springConfig);
      y.value = withSpring(0, springConfig);
    }
  }, [focused]);

  return (
    <View {...panResponder.panHandlers}>
      <TransactionMenu
        onShowChange={(show) => {
          setFocused(show);
          props.onShowMenu(show);
        }}
        transaction={item}
        touchableStyle={styles.newTransaction}
        disabled={focused}
      >
        <Animated.View style={buttonAnimation}>
          <Animated.View
            style={[
              styles.leftCheckContainer,
              { left: leftCheckX, opacity: checkOpacity },
            ]}
          >
            <Icon icon={Check} size={24} strokeWidth={2} color={'mainText'} />
          </Animated.View>
          <Box
            shadowColor="blackText"
            shadowOpacity={0.08}
            shadowOffset={{ width: 0, height: 2 }}
            shadowRadius={2}
          >
            <Box
              backgroundColor="newTransaction"
              borderColor="newTransactionBorder"
              shadowColor="newTransactionShadow"
              shadowOpacity={mode === 'dark' ? 1 : 0.3}
              shadowRadius={mode === 'dark' ? 12 : 8}
              shadowOffset={{ width: 0, height: 8 }}
              elevation={7}
              style={[styles.newTransaction, style]}
            >
              <View
                style={[
                  Platform.OS === 'ios'
                    ? styles.iosContentSpacing
                    : styles.androidContentSpacing,
                  contentStyle,
                ]}
              >
                <View style={styles.leftColumn}>
                  <InstitutionLogo
                    data={
                      plaidItemsData?.find((p) =>
                        p.accounts.find(
                          (account) => account.id === item.account
                        )
                      )?.institution?.logo
                    }
                  />
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionName}>
                      {focused
                        ? item.name.length > 40
                          ? `${item.name.slice(0, 40)} ...`
                          : item.name
                        : item.name.length > 17
                        ? `${item.name.slice(0, 17)} ...`
                        : item.name}
                    </Text>
                    <View style={styles.bottomRow}>
                      <Text color="secondaryText" fontSize={15}>
                        {formater.format(item.amount)}
                      </Text>
                      <Text color="tertiaryText" fontSize={15}>
                        {formatDateOrRelativeDate(
                          dayjs(item.datetime! || item.date).valueOf()
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.rightColumn}>
                  <View
                    style={[
                      styles.billCatLabelContainer,
                      { opacity: focused ? 0.2 : 1 },
                    ]}
                  >
                    <BillCatLabel
                      fontSize={14}
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
                      }
                    />
                  </View>
                </View>
              </View>
            </Box>
          </Box>
          <Animated.View
            style={[
              styles.rightCheckContainer,
              { right: rightCheckX, opacity: checkOpacity },
            ]}
          >
            <Icon icon={Check} size={24} strokeWidth={2} color={'mainText'} />
          </Animated.View>
        </Animated.View>
      </TransactionMenu>
    </View>
  );
};

export default Item;
