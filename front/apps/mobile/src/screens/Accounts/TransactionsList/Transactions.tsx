import { useEffect, useRef, useState } from 'react';
import {
  View,
  PanResponder,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable
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
import { Box, defaultSpringConfig, Text, CustomSectionList, Seperator } from '@ledget/native-ui';
import SkeletonTransactions from './SkeletonTransactions';
import type { PTransactions, Section, ListState } from './types';
import Row from './Row';

const SKELETON_HEIGHT = 740

const DRAG_THRESHOLD = Dimensions.get('window').height * 0.1
const ESCAPE_VELOCITY = 1.5

const Transactions = (props: PTransactions) => {
  const state = useRef<ListState>('neutral')
  const propTop = useRef(props.collapsedTop)
  const top = useSharedValue(props.collapsedTop)
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

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gs) => {

        if ((Math.abs(gs.dy) > DRAG_THRESHOLD) || (Math.abs(gs.vy) > ESCAPE_VELOCITY)) {
          if (gs.vy < 0) {
            top.value = withSpring(
              props.expandedTop,
              defaultSpringConfig);
            state.current = 'expanded';
            props.onStateChange?.('expanded');
          } else {
            top.value = withSpring(
              propTop.current,
              defaultSpringConfig);
            state.current = 'neutral';
            props.onStateChange?.('neutral');
          }
        } else {
          if (state.current === 'neutral' && gs.dy < 0) {
            top.value = propTop.current + gs.dy
          } else {
            top.value = props.expandedTop + gs.dy
          }
        }
      },
      onPanResponderRelease: (e, gs) => {
        // if (Math.abs(gs.dy) < DRAG_THRESHOLD) {
        //   scrollViewHeight.value = state.current === 'expanded'
        //     ? withSpring(expandedHeight, defaultSpringConfig)
        //     : withSpring(collapsedHeight, defaultSpringConfig)
        //   props.onDrag && props.onDrag(0, state.current === 'expanded');
        // }
        if (Math.abs(gs.dy) < DRAG_THRESHOLD) {
          top.value = state.current === 'expanded'
            ? withSpring(props.expandedTop, defaultSpringConfig)
            : withSpring(propTop.current, defaultSpringConfig)
        }
      },
      onPanResponderTerminationRequest: (e, gs) => {
        if (Math.abs(gs.dy) < DRAG_THRESHOLD) {
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
              <Pressable
                onPress={() =>
                  props.navigation.navigate('Transaction', { transaction: section.data[0] })
                }
                aria-role='button'
                aria-label='View transaction'
                onLayout={(e) => setSectionHeaderHeight(e.nativeEvent.layout.height)}
                style={styles.sectionHeader}
              >
                <Text fontSize={15} color='quaternaryText'>
                  {dayjs(section.title).format('MMM')}
                </Text>
                <Text fontSize={15} color='quaternaryText' style={{ opacity: section.title === stuckTitle ? 1 : 0 }}>
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
              <View style={{
                marginTop: i === 0 && section.index === 0
                  ? -1 * (sectionHeaderHeight + 18)
                  : i === 0 ? -1 * sectionHeaderHeight : 0
              }}
              >
                <Seperator backgroundColor={(section.index === 0 && i === 0) ? 'transparent' : 'lightseperator'} />
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate(
                      'Transaction',
                      { transaction: transaction }
                    )
                  }}
                  activeOpacity={.7}
                  key={transaction.transaction_id}
                >
                  <Row {...transaction} section={section} index={i} />
                </TouchableOpacity>
              </View>
            )}
            style={styles.transactionsScrollView}
          />}
      </Box>
    </Animated.View>
  )
}

export default Transactions
