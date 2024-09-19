import { useEffect, useRef, useState } from 'react';
import {
  View,
  PanResponder,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import dayjs from 'dayjs';
import { groupBy } from 'lodash-es';

import styles from './styles/transactions';
import { useLazyGetTransactionsQuery } from '@ledget/shared-features';
import { Box, defaultSpringConfig, Text, CustomSectionList } from '@ledget/native-ui';
import SkeletonTransactions from './SkeletonTransactions';
import type { PTransactions, Section, ListState } from './types';
import Row from './Row';

const SKELETON_HEIGHT = 740

const Transactions = (props: PTransactions) => {
  const state = useRef<ListState>('neutral')
  const propTop = useRef(props.collapsedTop)
  const top = useSharedValue(props.collapsedTop)
  const overlayHeight = useSharedValue(0)
  const [sectionHeaderHeight, setSectionHeaderHeight] = useState(0)
  const [getTransactions, { data: transactionsData }] = useLazyGetTransactionsQuery()
  const [stuckTitle, setStuckTitle] = useState<string | null>(null)
  const [sections, setSections] = useState<Section[]>([])

  const animation = useAnimatedStyle(() => {
    return {
      top: top.value,
      opacity: top.value ? 1 : 0,
    }
  }, [])

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

  useEffect(() => {
    top.value = props.collapsedTop
    propTop.current = props.collapsedTop
  }, [props.collapsedTop])

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gs) => {
      if (propTop.current === 0) return;
      if (state.current === 'neutral' && gs.dy < 0) {
        overlayHeight.value = Dimensions.get('window').height
        top.value = propTop.current + gs.dy
      } else if (state.current === 'expanded' && gs.dy > 0) {
        top.value = props.expandedTop + gs.dy
      }
    },
    onPanResponderRelease: (_, gs) => {
      if (state.current === 'neutral' && (gs.dy < -100 || gs.vy < -1.5)) {
        overlayHeight.value = Dimensions.get('window').height
        top.value = withSpring(props.expandedTop, defaultSpringConfig)
        state.current = 'expanded'
        props.onStateChange?.('expanded')
      } else if (state.current === 'expanded' && (gs.dy > 100 || gs.vy > 1.5)) {
        overlayHeight.value = 0
        top.value = withSpring(propTop.current, defaultSpringConfig)
        state.current = 'neutral'
        props.onStateChange?.('neutral')
      } else {
        if (state.current === 'expanded') {
          top.value = withSpring(props.expandedTop, defaultSpringConfig)
          overlayHeight.value = Dimensions.get('window').height
        } else {
          top.value = withSpring(propTop.current, defaultSpringConfig)
          overlayHeight.value = 0
        }
      }
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

    if (bottom && transactionsData?.next !== null && transactionsData) {
      getTransactions({
        account: props.account?.account_id,
        type: props.account?.type,
        offset: transactionsData.next,
        limit: transactionsData.limit
      });
    }
  };

  return (
    <Animated.View style={[styles.boxContainer, animation]}>
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
          <CustomSectionList
            bounces={true}
            overScrollMode='always'
            onScroll={handleScroll}
            sections={sections}
            stickySectionHeadersEnabled={true}
            renderSectionHeader={({ section }) => (
              <>
                <Box
                  onLayout={(e) => setSectionHeaderHeight(e.nativeEvent.layout.height)}
                  style={[styles.sectionHeader]}
                  backgroundColor='nestedContainer'>
                  <Text fontSize={15} color='quaternaryText'>
                    {dayjs(section.title).format('MMM')}
                  </Text>
                  <Text fontSize={15} color='quaternaryText' style={{ opacity: section.title === stuckTitle ? 1 : 0 }}>
                    {dayjs(section.title).format('YYYY')}
                  </Text>
                </Box>
              </>
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
              <TouchableOpacity
                onPress={() => props.navigation.navigate(
                  'Transaction',
                  { transaction: transaction }
                )}
                activeOpacity={.7} key={transaction.transaction_id}>
                <View style={{
                  marginTop: i === 0 && section.index === 0
                    ? -1 * (sectionHeaderHeight + 18)
                    : i === 0 ? -1 * sectionHeaderHeight : 0
                }}>
                  <Row {...transaction} section={section} />
                </View>
              </TouchableOpacity>
            )}
            style={styles.transactionsScrollView}
          />}
      </Box>
    </Animated.View>
  )
}

export default Transactions
