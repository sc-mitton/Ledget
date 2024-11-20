import { useEffect, useRef, useState } from 'react';
import {
  View,
  PanResponder,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
  RefreshControl,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import dayjs from 'dayjs';
import { groupBy } from 'lodash-es';
import { useTheme } from '@shopify/restyle';

import styles from './styles/transactions';
import { Account, useLazyGetTransactionsQuery, useTransactionsSyncMutation } from '@ledget/shared-features';
import { Box, defaultSpringConfig, Text, CustomSectionList } from '@ledget/native-ui';
import type { PTransactions, Section, ListState } from './types';
import SkeletonTransactions from './SkeletonTransactions';
import Row from './Row';
import EmptyList from './EmptyList';
import { useAppSelector } from '@/hooks';
import { selectAccountsTabDepositAccounts } from '@/features/uiSlice';

const SKELETON_HEIGHT = 740

const DRAG_THRESHOLD = Dimensions.get('window').height * 0.1
const ESCAPE_VELOCITY = 1.5

const Transactions = (props: PTransactions & { account?: Account }) => {
  const state = useRef<ListState>('neutral')
  const propTop = useRef(props.collapsedTop)
  const top = useSharedValue(props.collapsedTop)
  const [sectionHeaderHeight, setSectionHeaderHeight] = useState(0)
  const [stuckTitle, setStuckTitle] = useState<string | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [accounts, setAccounts] = useState<Account[]>()
  const theme = useTheme()

  const storedAccounts = useAppSelector(selectAccountsTabDepositAccounts)
  const [getTransactions, { data: transactionsData, isLoading: isLoadingTransactions }] = useLazyGetTransactionsQuery()
  const [syncTransactions, { isLoading: isSyncing }] = useTransactionsSyncMutation()

  const animation = useAnimatedStyle(() => {
    return {
      top: top.value,
      opacity: top.value ? 1 : 0,
    }
  }, [])

  useEffect(() => {
    if (props.account) {
      setAccounts([props.account])
    } else {
      setAccounts(storedAccounts)
    }
  }, [props.account, storedAccounts])

  useEffect(() => {
    if (accounts) {
      getTransactions(
        {
          accounts: accounts.map(a => a.id),
          limit: 25,
          offset: 0
        },
        true
      );
    }
  }, [accounts])

  useEffect(() => {
    top.value = props.collapsedTop
    propTop.current = props.collapsedTop
  }, [props.collapsedTop])

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gs) => {
        if ((gs.dy > 0 && state.current === 'neutral') || (gs.dy < 0 && state.current === 'expanded')) {
          return
        }

        top.value = state.current === 'neutral'
          ? propTop.current + gs.dy
          : props.expandedTop + gs.dy
      },
      onPanResponderRelease: (e, gs) => {
        if ((gs.dy > 0 && state.current === 'neutral') || (gs.dy < 0 && state.current === 'expanded')) {
          return
        }
        if ((Math.abs(gs.dy) > DRAG_THRESHOLD) || (Math.abs(gs.vy) > ESCAPE_VELOCITY)) {
          top.value = state.current === 'expanded'
            ? withSpring(propTop.current, defaultSpringConfig)
            : withSpring(props.expandedTop, defaultSpringConfig)
          props.onStateChange?.(state.current === 'expanded' ? 'neutral' : 'expanded')
          state.current = state.current === 'expanded' ? 'neutral' : 'expanded'
        } else {
          top.value = state.current === 'expanded'
            ? withSpring(props.expandedTop, defaultSpringConfig)
            : withSpring(propTop.current, defaultSpringConfig)
        }
        return true
      },
      onPanResponderTerminationRequest: (e, gs) => {
        if ((gs.dy > 0 && state.current === 'neutral') || (gs.dy < 0 && state.current === 'expanded')) {
          return true
        }
        if ((Math.abs(gs.dy) > DRAG_THRESHOLD) || (Math.abs(gs.vy) > ESCAPE_VELOCITY)) {
          top.value = state.current === 'expanded'
            ? withSpring(propTop.current, defaultSpringConfig)
            : withSpring(props.expandedTop, defaultSpringConfig)
          props.onStateChange?.(state.current === 'expanded' ? 'neutral' : 'expanded')
          state.current = state.current === 'expanded' ? 'neutral' : 'expanded'
        } else {
          top.value = state.current === 'expanded'
            ? withSpring(props.expandedTop, defaultSpringConfig)
            : withSpring(propTop.current, defaultSpringConfig)
        }
        return true
      }
    })).current

  // Set the sections once the transactions data is fetched
  useEffect(() => {
    if (transactionsData?.results) {
      setSections(
        Object.entries(groupBy(transactionsData?.results, (t) => dayjs(t.date).startOf('month').toISOString()))
          .map(([key, value], index) => ({
            title: key,
            data: value.map((t, i) => ({ ...t, lastInSection: i === value.length - 1 })),
            index: index
          })))
    }
  }, [transactionsData])

  // Initialize the stuck title once the sections are set
  useEffect(() => {
    setStuckTitle(sections[0]?.title || null)
  }, [sections])

  // Fetch more transactions
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // If at the bottom of the scroll view, fetch more transactions
    const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent
    const bottom = contentOffset.y + layoutMeasurement.height >= contentSize.height

    if (bottom && transactionsData?.next !== null && transactionsData && accounts) {
      getTransactions({
        accounts: accounts.map(a => a.id),
        offset: transactionsData.next,
        limit: transactionsData.limit
      });
    }
  };

  return (
    <Animated.View style={[styles.boxContainer, animation]}>
      <Box
        style={styles.mainBackgroundBox}
        backgroundColor={state.current === 'expanded' ? 'mainBackground' : 'transparent'}
        shadowColor='mainBackground'
        shadowOpacity={1}
        shadowRadius={24}
        shadowOffset={{ width: 0, height: 0 }}
      >
        <Box
          style={styles.box}
          shadowColor='navShadow'
          shadowOpacity={.1}
          shadowRadius={10}
          shadowOffset={{ width: 0, height: -12 }}
          borderColor='nestedContainerBorder'
          borderWidth={1}
          backgroundColor='nestedContainer'>
          {(transactionsData?.results.length || 0) > 0 &&
            <View style={styles.dragBarContainer} {...panResponder.panHandlers}>
              <Box style={styles.dragBar} borderRadius='circle' backgroundColor='dragBar' />
            </View>}
          {(transactionsData?.results.length || 0) <= 0 || isLoadingTransactions
            ?
            transactionsData?.results.length === 0 && !isLoadingTransactions && accounts
              ? <EmptyList {...props} />
              : <SkeletonTransactions height={SKELETON_HEIGHT} />
            :
            <CustomSectionList
              refreshControl={
                <RefreshControl
                  onRefresh={() => {
                    if (accounts) {
                      syncTransactions({ accounts: accounts.map(a => a.id) })
                    }
                  }}
                  refreshing={isSyncing}
                  style={{ transform: [{ scaleY: .7 }, { scaleX: .7 }] }}
                  colors={[theme.colors.blueText]}
                  progressBackgroundColor={theme.colors.modalBox}
                  tintColor={theme.colors.secondaryText}
                />}
              scrollIndicatorPadding={[0, theme.spacing.navHeight - 48]}
              contentContainerStyle={{ paddingBottom: theme.spacing.navHeight - 24 }}
              bounces={true}
              overScrollMode='always'
              onScroll={handleScroll}
              sections={sections}
              stickySectionHeadersEnabled={true}
              renderSectionHeader={({ section }) => (
                <Pressable
                  onPress={() =>
                    props.navigation.navigate('Transaction', { transaction: section.data[0] })
                  }
                  aria-role='button'
                  aria-label='View transaction'
                  onLayout={(e) => setSectionHeaderHeight(e.nativeEvent.layout.height)}
                  style={styles.sectionHeader}
                >
                  <Text fontSize={15} color='quinaryText'>
                    {dayjs(section.title).format('MMM')}
                  </Text>
                  <Text fontSize={15} color='quinaryText' style={{ opacity: section.title === stuckTitle ? 1 : 0 }}>
                    {dayjs(section.title).format('YYYY')}
                  </Text>
                </Pressable>
              )}
              viewabilityConfig={{
                waitForInteraction: false,
                minimumViewTime: 10,
                viewAreaCoveragePercentThreshold: 0
              }}
              onViewableItemsChanged={({ changed, viewableItems }) => {
                if (changed.length > 1 && viewableItems.length > 0) {
                  setStuckTitle(viewableItems[1]?.section.title)
                }
              }}
              keyExtractor={(item, index) => item.transaction_id}
              renderItem={({ item: transaction, index: i, section }) => (
                <View
                  key={transaction.transaction_id}
                  style={{
                    marginTop: i === 0 && section.index === 0
                      ? -1 * (sectionHeaderHeight + 10)
                      : i === 0 ? -1 * sectionHeaderHeight : 0
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      props.navigation.navigate(
                        'Transaction',
                        { transaction: transaction }
                      )
                    }}
                    activeOpacity={.7}
                  >
                    <Row {...transaction} section={section} index={i} />
                  </TouchableOpacity>
                </View>
              )}
              style={styles.transactionsScrollView}
            />}
        </Box>
      </Box>
    </Animated.View>
  )
}

export default Transactions
