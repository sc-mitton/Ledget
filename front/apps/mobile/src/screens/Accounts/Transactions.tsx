import { useEffect, useRef, useState } from 'react';
import { View, PanResponder, NativeSyntheticEvent, NativeScrollEvent, ScrollView } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import dayjs from 'dayjs';

import styles from './styles/transactions';
import { Hourglass } from '@ledget/media/native';
import { Transaction, useLazyGetTransactionsQuery } from '@ledget/shared-features';
import type { AccountType } from '@ledget/shared-features';
import {
  Box,
  defaultSpringConfig,
  CustomScrollView,
  DollarCents,
  Text,
  Seperator,
  Icon
} from '@ledget/native-ui';
import SkeletonTransactions from './SkeletonTransactions';

interface PTransactions {
  top: number
  account?: string
  accountType: AccountType
}

const EXPANDED_TOP = 16
const SKELETON_HEIGHT = 740

const Row = (props: Transaction & { index: number }) => {

  return (
    <View>
      {props.index !== 0 && <Seperator />}
      <View style={styles.row}>
        <View style={styles.leftColumn}>
          <View style={styles.nameContainer}>
            {props.pending && <Icon icon={Hourglass} size={16} />}
            <Text fontSize={15}>
              {props.name.length > 20 ? props.name.slice(0, 20) + '...' : props.name}
            </Text>
          </View>
          <Text color='tertiaryText' fontSize={15}>
            {dayjs(props.date).format('M/D/YYYY')}
          </Text>
        </View>
        <View style={styles.rightColumn}>
          <DollarCents
            fontSize={15}
            value={props.amount}
            color={props.amount < 0 ? 'greenText' : 'mainText'}
          />
        </View>
      </View>
    </View>
  )
}

const Transactions = (props: PTransactions) => {
  const state = useRef<'neutral' | 'expanded'>('neutral')
  const propTop = useRef(props.top)
  const dateScrollRef = useRef<ScrollView>(null)
  const top = useSharedValue(0)
  const [getTransactions, { data: transactionsData }] = useLazyGetTransactionsQuery()

  useEffect(() => {
    if (props.account) {
      getTransactions(
        {
          account: props.account,
          type: props.accountType,
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
        account: props.account!,
        type: props.accountType,
        offset: transactionsData.next,
        limit: transactionsData.limit
      });
    }
  };

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gs) => {
      if (state.current === 'neutral' && gs.dy < 0) {
        top.value = propTop.current + gs.dy
      } else if (state.current === 'expanded' && gs.dy > 0) {
        top.value = EXPANDED_TOP + gs.dy
      }
    },
    onPanResponderRelease: (_, gs) => {
      if (state.current === 'neutral' && (gs.dy < -100 || gs.vy < -1.5)) {
        top.value = withSpring(EXPANDED_TOP, defaultSpringConfig)
        state.current = 'expanded'
      } else if (state.current === 'expanded' && (gs.dy > 100 || gs.vy > 1.5)) {
        top.value = withSpring(propTop.current, defaultSpringConfig)
        state.current = 'neutral'
      } else {
        state.current === 'expanded'
          ? top.value = withSpring(EXPANDED_TOP, defaultSpringConfig)
          : top.value = withSpring(propTop.current, defaultSpringConfig)
      }
    }
  })).current

  useEffect(() => {
    top.value = props.top
    propTop.current = props.top
  }, [props.top])

  return (
    <Animated.View style={[styles.boxContainer, { top: top }]}>
      <Box
        style={styles.box}
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
            <CustomScrollView
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
                      <View style={styles.hiddenRow}>
                        <Row
                          key={transaction.transaction_id}
                          {...transaction}
                          index={i}
                        />
                      </View>
                    </View>
                  </View>
                )
              })}
            </CustomScrollView>
            <CustomScrollView
              onScroll={handleScroll}
              style={styles.transactionsScrollView}
            >
              {transactionsData.results.map((transaction, i) => (
                <Row
                  key={transaction.transaction_id}
                  {...transaction}
                  index={i}
                />
              ))}
            </CustomScrollView>
          </View>}
      </Box>
    </Animated.View>
  )
}

export default Transactions
