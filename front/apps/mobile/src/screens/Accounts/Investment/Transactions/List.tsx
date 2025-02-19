import { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  Pressable,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import dayjs from 'dayjs';
import { groupBy } from 'lodash-es';
import { useTheme } from '@shopify/restyle';

import styles from './styles/list';
import {
  useLazyGetInvestmentsQuery,
  InvestmentTransaction,
  isInvestmentSupported,
} from '@ledget/shared-features';
import {
  Box,
  defaultSpringConfig,
  Text,
  CustomSectionList,
  LoadingDots,
} from '@ledget/native-ui';
import {
  selectInvestmentsScreenAccounts,
  selectInvestmentsScreenWindow,
} from '@/features/uiSlice';
import type { PTransactions, Section, ListState } from './types';
import { useAppSelector } from '@/hooks';
import SkeletonTransactions from '../../TransactionsList/SkeletonTransactions';
import Row from './Row';

const SKELETON_HEIGHT = 740;

const DRAG_THRESHOLD = Dimensions.get('window').height * 0.2;
const ESCAPE_VELOCITY = 1.5;

const Transactions = (props: PTransactions) => {
  const state = useSharedValue(0); // 0 = neutral, 1 = expanded
  const top = useSharedValue(props.collapsedTop);
  const theme = useTheme();
  const accounts = useAppSelector(selectInvestmentsScreenAccounts);
  const [sectionHeaderHeight, setSectionHeaderHeight] = useState(0);
  const [stuckTitle, setStuckTitle] = useState<string | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [transactionsData, setTransactionsData] = useState<
    InvestmentTransaction[]
  >([]);
  const window = useAppSelector(selectInvestmentsScreenWindow);

  const [
    getInvestments,
    { data: investmentsData, isLoading: isLoadingInvestmentsData },
  ] = useLazyGetInvestmentsQuery();

  const animation = useAnimatedStyle(() => {
    return {
      top: top.value,
      opacity: top.value ? 1 : 0,
    };
  }, []);

  useEffect(() => {
    if (window) {
      getInvestments(
        {
          end: dayjs().format('YYYY-MM-DD'),
          start: dayjs()
            .subtract(window?.amount || 100, window?.period || 'year')
            .format('YYYY-MM-DD'),
        },
        true
      );
    }
  }, [window]);

  useEffect(() => {
    setTransactionsData(
      investmentsData?.results
        ?.filter(
          (i) =>
            accounts === undefined ||
            accounts?.some((a) => a.id === i.account_id)
        )
        .filter((i) => isInvestmentSupported(i))
        .reduce((acc, investment) => {
          return acc.concat(investment.transactions);
        }, [] as InvestmentTransaction[]) || []
    );
  }, [investmentsData]);

  useEffect(() => {
    const newSections = Object.entries(
      groupBy(transactionsData, (t) =>
        dayjs(t.date).startOf('month').toISOString()
      )
    ).map(([key, value], index) => ({
      title: key,
      data: value.map((t, i) => ({
        ...t,
        lastInSection: i === value.length - 1,
      })),
      index: index,
    }));
    setSections(newSections);
    setStuckTitle(newSections[0]?.title || null);
  }, [transactionsData]);

  useEffect(() => {
    top.value = props.collapsedTop;
  }, [props.collapsedTop]);

  const gesture = Gesture.Pan()
    .onStart(({ translationY: ty }) => {
      if ((ty > 0 && state.value === 0) || (ty < 0 && state.value === 1)) {
        return;
      }

      top.value =
        state.value === 0
          ? withSpring(props.collapsedTop + ty)
          : withSpring(props.expandedTop + ty);
    })
    .onChange(({ translationY: ty }) => {
      if ((ty > 0 && state.value === 0) || (ty < 0 && state.value === 1)) {
        return;
      }

      top.value =
        state.value === 0 ? props.collapsedTop + ty : props.expandedTop + ty;
    })
    .onEnd(({ translationY: ty, velocityY: vy }) => {
      if ((ty > 0 && state.value === 0) || (ty < 0 && state.value === 1)) {
        return true;
      }
      if (Math.abs(ty) > DRAG_THRESHOLD || Math.abs(vy) > ESCAPE_VELOCITY) {
        top.value =
          state.value === 1
            ? withSpring(props.collapsedTop, defaultSpringConfig)
            : withSpring(props.expandedTop, defaultSpringConfig);
        props.onStateChange &&
          runOnJS(props.onStateChange)(
            state.value === 1 ? 'neutral' : 'expanded'
          );
        state.value = state.value === 1 ? 0 : 1;
      } else {
        top.value =
          state.value === 1
            ? withSpring(props.expandedTop, defaultSpringConfig)
            : withSpring(props.collapsedTop, defaultSpringConfig);
      }
    });

  // Fetch more
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // If at the bottom of the scroll view, fetch more transactions
    const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
    const bottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height;

    if (bottom && investmentsData?.cursor) {
      getInvestments(
        {
          end: dayjs().format('YYYY-MM-DD'),
          start: dayjs()
            .subtract(window?.amount || 100, window?.period || 'year')
            .format('YYYY-MM-DD'),
          cursor: investmentsData.cursor,
        },
        true
      );
    }
  };

  return (
    <Animated.View style={[styles.boxContainer, animation]}>
      {/* To cover the sides of the graph when expanded  */}
      <Box backgroundColor="mainBackground" style={styles.backgroundSheet} />
      <Box style={styles.mainBackgroundBox}>
        <Box
          style={styles.box}
          shadowColor="navShadow"
          shadowOpacity={0.1}
          shadowRadius={10}
          shadowOffset={{ width: 0, height: -12 }}
          borderColor="nestedContainerBorder"
          borderWidth={1}
          backgroundColor="nestedContainer"
        >
          {(transactionsData?.length || 0) > 0 && (
            <GestureDetector gesture={gesture}>
              <View style={styles.dragBarContainer}>
                <Box
                  style={styles.dragBar}
                  borderRadius="circle"
                  backgroundColor="dragBar"
                />
              </View>
            </GestureDetector>
          )}
          {isLoadingInvestmentsData ? (
            <SkeletonTransactions height={SKELETON_HEIGHT} />
          ) : (
            <CustomSectionList
              bounces={true}
              overScrollMode="always"
              sections={sections}
              scrollIndicatorPadding={[0, theme.spacing.navHeight]}
              contentContainerStyle={{ paddingBottom: theme.spacing.navHeight }}
              stickySectionHeadersEnabled={true}
              onScroll={handleScroll}
              renderSectionHeader={({ section }) => (
                <Pressable
                  key={`section-${section.index}`}
                  onPress={() =>
                    props.navigation.navigate('InvestmentTransaction', {
                      transaction: section.data[0],
                    })
                  }
                  aria-role="button"
                  aria-label="View transaction"
                  onLayout={(e) =>
                    setSectionHeaderHeight(e.nativeEvent.layout.height)
                  }
                  style={styles.sectionHeader}
                >
                  <Text fontSize={15} color="tertiaryText">
                    {dayjs(section.title).format('MMM')}
                  </Text>
                  <Text
                    fontSize={15}
                    color="tertiaryText"
                    style={{ opacity: section.title === stuckTitle ? 1 : 0 }}
                  >
                    {dayjs(section.title).format('YYYY')}
                  </Text>
                </Pressable>
              )}
              viewabilityConfig={{
                waitForInteraction: false,
                minimumViewTime: 10,
                viewAreaCoveragePercentThreshold: 0,
              }}
              onViewableItemsChanged={({ changed, viewableItems }) => {
                if (
                  changed.length > 1 &&
                  viewableItems.length > 0 &&
                  viewableItems[1]?.section.title
                ) {
                  setStuckTitle(viewableItems[1]?.section.title);
                }
              }}
              keyExtractor={(_, index) => `transaction-${index}`}
              renderItem={({ item: transaction, index: i, section }) => (
                <Box
                  borderBottomColor={'nestedContainerSeperator'}
                  borderBottomWidth={1.5}
                  style={[
                    {
                      marginTop:
                        i === 0 && section.index === 0
                          ? -1 * (sectionHeaderHeight + 10)
                          : i === 0
                          ? -1 * sectionHeaderHeight
                          : 0,
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      props.navigation.navigate('InvestmentTransaction', {
                        transaction: transaction,
                      });
                    }}
                    activeOpacity={0.7}
                  >
                    <Row
                      transaction={transaction}
                      section={section}
                      index={i}
                    />
                  </TouchableOpacity>
                </Box>
              )}
              style={styles.transactionsScrollView}
            />
          )}
          <View
            style={[
              styles.loadingIndicatorContainer,
              { bottom: theme.spacing.navHeight - 24 },
            ]}
          >
            <View style={styles.loadingIndicator}>
              <LoadingDots visible={isLoadingInvestmentsData} />
            </View>
          </View>
        </Box>
      </Box>
    </Animated.View>
  );
};

export default Transactions;
