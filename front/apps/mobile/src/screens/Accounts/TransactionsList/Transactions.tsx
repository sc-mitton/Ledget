import { useEffect, useRef, useState } from 'react';
import {
  View,
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
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import dayjs from 'dayjs';
import { groupBy } from 'lodash-es';
import { useTheme } from '@shopify/restyle';

import styles from './styles/transactions';
import {
  Account,
  useLazyGetTransactionsQuery,
  useTransactionsSyncMutation,
} from '@ledget/shared-features';
import {
  Box,
  defaultSpringConfig,
  Text,
  CustomSectionList,
} from '@ledget/native-ui';
import type { PTransactions, Section } from './types';
import SkeletonTransactions from './SkeletonTransactions';
import Row from './Row';
import EmptyList from './EmptyList';
import { useAppSelector } from '@/hooks';
import { selectAccountsTabDepositAccounts } from '@/features/uiSlice';

const SKELETON_HEIGHT = 740;

const DRAG_THRESHOLD = Dimensions.get('window').height * 0.1;
const ESCAPE_VELOCITY = 1.5;

const Transactions = (props: PTransactions & { account?: Account }) => {
  const state = useSharedValue(0); // 0 = neutral, 1 = expanded
  const propTop = useRef(props.collapsedTop);
  const top = useSharedValue(props.collapsedTop);
  const [sectionHeaderHeight, setSectionHeaderHeight] = useState(0);
  const [stuckTitle, setStuckTitle] = useState<string | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [accounts, setAccounts] = useState<Account[]>();
  const theme = useTheme();

  const storedAccounts = useAppSelector(selectAccountsTabDepositAccounts);
  const [
    getTransactions,
    { data: transactionsData, isFetching: isFetchingTransactions },
  ] = useLazyGetTransactionsQuery();
  const [syncTransactions, { isLoading: isSyncing }] =
    useTransactionsSyncMutation();

  const animation = useAnimatedStyle(() => {
    return {
      top: top.value,
      opacity:
        top.value !== 0
          ? withTiming(1, { duration: 200 })
          : withTiming(0, { duration: 200 }),
    };
  }, []);

  useEffect(() => {
    if (props.account) {
      setAccounts([props.account]);
    } else {
      setAccounts(storedAccounts);
    }
  }, [props.account, storedAccounts]);

  useEffect(() => {
    if (accounts) {
      getTransactions(
        {
          accounts: accounts.map((a) => a.id),
          limit: 25,
          offset: 0,
        },
        true
      );
    }
  }, [accounts]);

  useEffect(() => {
    top.value = props.collapsedTop;
    propTop.current = props.collapsedTop;
  }, [props.collapsedTop]);

  const gesture = Gesture.Pan()
    .onStart(({ translationY: ty }) => {
      if ((ty > 0 && state.value === 0) || (ty < 0 && state.value === 1)) {
        return;
      }

      top.value =
        state.value === 0
          ? withSpring(propTop.current + ty)
          : withSpring(props.expandedTop + ty);
    })
    .onChange(({ translationY: ty }) => {
      if ((ty > 0 && state.value === 0) || (ty < 0 && state.value === 1)) {
        return;
      }

      top.value =
        state.value === 0 ? propTop.current + ty : props.expandedTop + ty;
    })
    .onEnd(({ translationY: ty, velocityY: vy }) => {
      if ((ty > 0 && state.value === 0) || (ty < 0 && state.value === 1)) {
        return true;
      }
      if (Math.abs(ty) > DRAG_THRESHOLD || Math.abs(vy) > ESCAPE_VELOCITY) {
        top.value =
          state.value === 1
            ? withSpring(propTop.current, defaultSpringConfig)
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
            : withSpring(propTop.current, defaultSpringConfig);
      }
    });

  // Set the sections once the transactions data is fetched
  useEffect(() => {
    if (transactionsData?.results) {
      setSections(
        Object.entries(
          groupBy(transactionsData?.results, (t) =>
            dayjs(t.date).startOf('month').toISOString()
          )
        ).map(([key, value], index) => ({
          title: key,
          data: value.map((t, i) => ({
            ...t,
            lastInSection: i === value.length - 1,
          })),
          index: index,
        }))
      );
    }
  }, [transactionsData]);

  // Initialize the stuck title once the sections are set
  useEffect(() => {
    setStuckTitle(sections[0]?.title || null);
  }, [sections]);

  // Fetch more transactions
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // If at the bottom of the scroll view, fetch more transactions
    const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
    const bottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height;

    if (
      bottom &&
      transactionsData?.next !== null &&
      transactionsData &&
      accounts
    ) {
      getTransactions({
        accounts: accounts.map((a) => a.id),
        offset: transactionsData.next,
        limit: transactionsData.limit,
      });
    }
  };

  return (
    <Animated.View style={[styles.boxContainer, animation]}>
      <Box
        style={styles.mainBackgroundBox}
        backgroundColor={state.value === 1 ? 'mainBackground' : 'transparent'}
        shadowColor="mainBackground"
        shadowOpacity={1}
        shadowRadius={24}
        shadowOffset={{ width: 0, height: 0 }}
      >
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
          {(transactionsData?.results.length || 0) > 0 && (
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
          {(transactionsData?.results.length || 0) <= 0 ||
          isFetchingTransactions ? (
            isFetchingTransactions ? (
              <SkeletonTransactions height={SKELETON_HEIGHT} />
            ) : (
              <EmptyList {...props} />
            )
          ) : (
            <CustomSectionList
              refreshControl={
                <RefreshControl
                  onRefresh={() => {
                    if (accounts) {
                      syncTransactions({ accounts: accounts.map((a) => a.id) });
                    }
                  }}
                  refreshing={isSyncing}
                  style={{ transform: [{ scaleY: 0.7 }, { scaleX: 0.7 }] }}
                  colors={[theme.colors.blueText]}
                  progressBackgroundColor={theme.colors.modalBox}
                  tintColor={theme.colors.secondaryText}
                />
              }
              scrollIndicatorPadding={[0, theme.spacing.navHeight - 48]}
              contentContainerStyle={{
                paddingBottom: theme.spacing.navHeight - 24,
              }}
              bounces={true}
              overScrollMode="always"
              onScroll={handleScroll}
              sections={sections}
              stickySectionHeadersEnabled={true}
              renderSectionHeader={({ section }) => (
                <Pressable
                  onPress={() =>
                    props.navigation.navigate('Transaction', {
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
                  <Text fontSize={14} color="tertiaryText">
                    {dayjs(section.title).format('MMM')}
                  </Text>
                  <Text
                    fontSize={14}
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
                if (changed.length > 1 && viewableItems.length > 0) {
                  setStuckTitle(viewableItems[1]?.section.title);
                }
              }}
              keyExtractor={(item, index) => item.transaction_id}
              renderItem={({ item: transaction, index: i, section }) => (
                <Box
                  key={transaction.transaction_id}
                  borderBottomColor={'nestedContainerSeperator'}
                  borderBottomWidth={1.5}
                  style={{
                    marginTop:
                      i === 0 && section.index === 0
                        ? -1 * (sectionHeaderHeight + 10)
                        : i === 0
                        ? -1 * sectionHeaderHeight
                        : 0,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      props.navigation.navigate('Transaction', {
                        transaction: transaction,
                      });
                    }}
                    activeOpacity={0.7}
                  >
                    <Row {...transaction} section={section} index={i} />
                  </TouchableOpacity>
                </Box>
              )}
              style={styles.transactionsScrollView}
            />
          )}
        </Box>
      </Box>
    </Animated.View>
  );
};

export default Transactions;
