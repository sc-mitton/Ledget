import { useEffect, useRef } from 'react';
import {
  View,
  PanResponder,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  NativeModules,
  ScrollView
} from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  interpolate,
  useAnimatedStyle
} from 'react-native-reanimated';
import dayjs from 'dayjs';
import { useTheme } from '@shopify/restyle';

import styles from './styles/transactions';
import { Hourglass } from '@ledget/media/native';
import { Transaction, useLazyGetTransactionsQuery } from '@ledget/shared-features';
import type { Account } from '@ledget/shared-features';
import {
  Box,
  defaultSpringConfig,
  DollarCents,
  Text,
  Seperator,
  Icon
} from '@ledget/native-ui';
import SkeletonTransactions from './SkeletonTransactions';
import { AccountsScreenProps } from '@types';

const { StatusBarManager } = NativeModules;

interface PTransactions extends AccountsScreenProps<'Main'> {
  top: number
  account?: Account
}

const EXPANDED_TOP = StatusBarManager.HEIGHT + 20
const SKELETON_HEIGHT = 740

const Row = (props: Partial<Transaction> & { index?: number }) => {

  return (
    <View>
      {props.index !== 0 && <Seperator />}
      <View style={styles.transactionRow}>
        <View style={styles.leftColumn}>
          <View style={styles.nameContainer}>
            {props.pending && <Icon icon={Hourglass} size={16} />}
            <Text fontSize={15}>
              {(props.name?.length || 0) > 20 ? props.name?.slice(0, 20) + '...' : props.name}
            </Text>
          </View>
          <Text color='quaternaryText' fontSize={15}>
            {dayjs(props.date).format('M/D/YYYY')}
          </Text>
        </View>
        <View style={styles.rightColumn}>
          <DollarCents
            fontSize={15}
            value={props.amount || 0}
            color={(props.amount || 0) < 0 ? 'greenText' : 'mainText'}
          />
        </View>
      </View>
    </View>
  )
}

const Transactions = (props: PTransactions) => {
  const theme = useTheme()
  const state = useRef<'neutral' | 'expanded'>('neutral')
  const propTop = useRef(props.top)
  const dateScrollRef = useRef<ScrollView>(null)
  const top = useSharedValue(0)
  const overlayHeight = useSharedValue(0)
  const [getTransactions, { data: transactionsData }] = useLazyGetTransactionsQuery()

  const overlayAnimation = useAnimatedStyle(() => ({
    opacity: interpolate(top.value, [props.top, EXPANDED_TOP], [0, .9]),
    height: overlayHeight.value
  }));

  useEffect(() => {
    if (props.account) {
      getTransactions(
        {
          account: props.account.account_id,
          type: props.account.type,
          limit: 25,
          offset: 0
        },
        true
      );
    }
  }, [props.account])

  // Fetch more transactions
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // If at the bottom of the scroll view, fetch more transactions
    const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent
    const bottom = contentOffset.y + layoutMeasurement.height >= contentSize.height

    // Track the date scroll view with the transactions scroll view
    if (dateScrollRef.current) {
      dateScrollRef.current.scrollTo({ y: contentOffset.y, animated: false })
    }

    if (bottom && transactionsData?.next !== null && transactionsData) {
      getTransactions({
        account: props.account?.account_id,
        type: props.account?.type,
        offset: transactionsData.next,
        limit: transactionsData.limit
      });
    }
  };

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gs) => {
      if (state.current === 'neutral' && gs.dy < 0) {
        overlayHeight.value = Dimensions.get('window').height
        top.value = propTop.current + gs.dy
      } else if (state.current === 'expanded' && gs.dy > 0) {
        top.value = EXPANDED_TOP + gs.dy
      }
    },
    onPanResponderRelease: (_, gs) => {
      if (state.current === 'neutral' && (gs.dy < -100 || gs.vy < -1.5)) {
        overlayHeight.value = Dimensions.get('window').height
        top.value = withSpring(EXPANDED_TOP, defaultSpringConfig)
        state.current = 'expanded'
      } else if (state.current === 'expanded' && (gs.dy > 100 || gs.vy > 1.5)) {
        overlayHeight.value = 0
        top.value = withSpring(propTop.current, defaultSpringConfig)
        state.current = 'neutral'
      } else {
        if (state.current === 'expanded') {
          top.value = withSpring(EXPANDED_TOP, defaultSpringConfig)
          overlayHeight.value = Dimensions.get('window').height
        } else {
          top.value = withSpring(propTop.current, defaultSpringConfig)
          overlayHeight.value = 0
        }
      }
    }
  })).current

  useEffect(() => {
    top.value = props.top
    propTop.current = props.top
  }, [props.top])

  return (
    <>
      <Animated.View style={[
        StyleSheet.absoluteFill,
        overlayAnimation,
        { backgroundColor: theme.colors.modalOverlay }]}
      />
      <Animated.View style={[styles.boxContainer, { top: top }]}>
        <Box
          style={styles.box}
          borderColor='nestedContainerBorder'
          borderWidth={1.5}
          backgroundColor='nestedContainer'>
          <View style={styles.dragBarContainer} {...panResponder.panHandlers}>
            <Box style={styles.dragBar} backgroundColor='dragBar' />
          </View>
          {!transactionsData
            ?
            <View style={styles.skeletonContainer}>
              <SkeletonTransactions height={SKELETON_HEIGHT} />
            </View>
            :
            <View style={styles.table}>
              <ScrollView
                bounces={false}
                ref={dateScrollRef}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                stickyHeaderIndices={transactionsData.results.map((_, i) => i).reverse()}
                style={styles.dateScrollView}>
                {transactionsData.results.map((transaction, i) => {
                  const date = dayjs(transaction.date)
                  const previousDate = i > 0 ? dayjs(transactionsData.results[i - 1].date) : null
                  return (
                    <View style={[styles.dateScrollViewRow]}>
                      <View style={styles.dateContentContainer}>
                        <Box style={styles.dateContent} backgroundColor='nestedContainer'>
                          {(!previousDate || date.month() !== previousDate.month())
                            && <Text fontSize={14} color='tertiaryText'>{date.format('MMM')}</Text>}
                          {(!previousDate || date.year() !== previousDate.year())
                            && <Text fontSize={14} color='tertiaryText'>{date.format('YYYY')}</Text>}
                        </Box>
                        <View style={styles.hiddenRowContainer}>
                          <View style={styles.hiddenRow}>
                            {i !== 0 && <Seperator />}
                            <Text fontSize={15}>H</Text>
                            <Text fontSize={15}>6</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  )
                })}
                {/* Spacer */}
                <View style={{ height: 200, width: '100%' }} />
              </ScrollView>
              <FlatList
                data={transactionsData.results}
                renderItem={({ item: transaction, index: i }) => (
                  <TouchableOpacity
                    onPress={() => props.navigation.navigate('Transaction', { id: transaction.transaction_id })}
                    activeOpacity={.7} key={transaction.transaction_id}>
                    <Row {...transaction} index={i} />
                  </TouchableOpacity>
                )}
                bounces={false}
                onScroll={handleScroll}
                style={styles.transactionsScrollView}
              />
            </View>}
        </Box>
      </Animated.View>
    </>
  )
}

export default Transactions
