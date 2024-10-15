import { useEffect, useRef, useState } from 'react';
import {
  View,
  PanResponder,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import dayjs from 'dayjs';
import { groupBy } from 'lodash-es';
import { useTheme } from '@shopify/restyle';

import styles from './styles/list';
import { useGetInvestmentsQuery, InvestmentTransaction, isInvestmentSupported } from '@ledget/shared-features';
import { Box, defaultSpringConfig, Text, CustomSectionList } from '@ledget/native-ui';
import { selectInvestmentsScreenAccounts, selectInvestmentsScreenWindow } from '@/features/uiSlice';
import type { PTransactions, Section, ListState } from './types';
import { useAppSelector } from '@/hooks';
import SkeletonTransactions from '../../TransactionsList/SkeletonTransactions';
import Row from './Row';

const SKELETON_HEIGHT = 740

const DRAG_THRESHOLD = Dimensions.get('window').height * 0.1
const ESCAPE_VELOCITY = 1.5

const Transactions = (props: PTransactions) => {
  const state = useRef<ListState>('neutral')
  const propTop = useRef(props.collapsedTop)
  const top = useSharedValue(props.collapsedTop)
  const theme = useTheme()
  const accounts = useAppSelector(selectInvestmentsScreenAccounts)
  const [sectionHeaderHeight, setSectionHeaderHeight] = useState(0)
  const [stuckTitle, setStuckTitle] = useState<string | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [transactionsData, setTransactionsData] = useState<InvestmentTransaction[]>([])
  const window = useAppSelector(selectInvestmentsScreenWindow)

  const { data: investmentsData, isLoading: isLoadingInvestmentsData } = useGetInvestmentsQuery({
    end: dayjs().format('YYYY-MM-DD'),
    start: dayjs().subtract(window?.amount || 100, window?.period || 'year').format('YYYY-MM-DD')
  }, {
    skip: !window
  })

  const animation = useAnimatedStyle(() => {
    return {
      top: top.value,
      opacity: top.value ? 1 : 0,
    }
  }, [])

  useEffect(() => {
    setTransactionsData(
      investmentsData
        ?.filter(i => accounts === undefined || accounts?.some(a => a.id === i.account_id))
        .filter(i => isInvestmentSupported(i)).reduce((acc, investment) => {
          return acc.concat(investment.transactions)
        }, [] as InvestmentTransaction[]) || []
    )
  }, [investmentsData])

  useEffect(() => {
    const newSections = Object.entries(groupBy(transactionsData, (t) => dayjs(t.date).startOf('month').toISOString()))
      .map(([key, value], index) => ({
        title: key,
        data: value.map((t, i) => ({ ...t, lastInSection: i === value.length - 1 })),
        index: index
      }))
    setSections(newSections)
    setStuckTitle(newSections[0]?.title || null)
  }, [transactionsData])

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

  return (
    <Animated.View style={[styles.boxContainer, animation]}>
      <Box style={styles.mainBackgroundBox}>
        <Box
          style={styles.box}
          shadowColor='navShadow'
          shadowOpacity={.1}
          shadowRadius={10}
          shadowOffset={{ width: 0, height: -12 }}
          borderColor='nestedContainerBorder'
          borderWidth={1}
          backgroundColor='nestedContainer'>
          {(transactionsData?.length || 0) > 0 &&
            <View style={styles.dragBarContainer} {...panResponder.panHandlers}>
              <Box style={styles.dragBar} borderRadius='circle' backgroundColor='dragBar' />
            </View>}
          {(transactionsData?.length || 0) <= 0 || isLoadingInvestmentsData
            ?
            <SkeletonTransactions height={SKELETON_HEIGHT} />
            :
            <CustomSectionList
              bounces={true}
              overScrollMode='always'
              sections={sections}
              scrollIndicatorPadding={[0, theme.spacing.navHeight - 64]}
              contentContainerStyle={{ paddingBottom: theme.spacing.navHeight - 48 }}
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
                if (changed.length > 1 && viewableItems.length > 0 && viewableItems[1]?.section.title) {
                  setStuckTitle(viewableItems[1]?.section.title)
                }
              }}
              keyExtractor={(item, index) => item.transaction_id}
              renderItem={({ item: transaction, index: i, section }) => (
                <View
                  key={transaction.transaction_id}
                  style={[
                    {
                      marginTop: i === 0 && section.index === 0
                        ? -1 * (sectionHeaderHeight + 10)
                        : i === 0 ? -1 * sectionHeaderHeight : 0
                    }
                  ]}
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
                    <Row transaction={transaction} section={section} index={i} />
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
