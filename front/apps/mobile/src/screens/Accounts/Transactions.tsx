import { useEffect, useRef, useState } from 'react';
import { View, PanResponder } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

import styles from './styles/transactions';
import { useLazyGetTransactionsQuery } from '@ledget/shared-features';
import {
  Box,
  defaultSpringConfig,
  CustomScrollView
} from '@ledget/native-ui';
import SkeletonTransactions from './SkeletonTransactions';

interface PTransactions {
  top: number
  account?: string
}

const EXPANDED_TOP = 16

const Transactions = (props: PTransactions) => {
  const state = useRef<'neutral' | 'expanded'>('neutral')
  const top = useSharedValue(0)
  const propTop = useRef(props.top)
  const [skeletonHeight, setSkeletonHeight] = useState(0)
  const [getTransactions, { data: transactionsData }] = useLazyGetTransactionsQuery()

  useEffect(() => {
    if (props.account) {
      getTransactions({ account: props.account }, true)
    }
  }, [props.account])

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
        <CustomScrollView
          style={styles.scrollView}
          onLayout={(e) => setSkeletonHeight(e.nativeEvent.layout.height)}>
          {!transactionsData
            ? <SkeletonTransactions height={skeletonHeight} />
            : transactionsData.results.map((transaction, index) => (
              <></>
            ))
          }
        </CustomScrollView>
      </Box>
    </Animated.View>
  )
}

export default Transactions
