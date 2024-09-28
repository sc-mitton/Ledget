import { useEffect, useState } from 'react'
import { TouchableOpacity, View, NativeSyntheticEvent, NativeScrollEvent } from 'react-native'
import { CartesianChart, Area, Line, useChartPressState } from 'victory-native'
import {
  useFont,
  Text as SkText,
  Circle,
  LinearGradient,
  vec
} from '@shopify/react-native-skia'
import { useDerivedValue } from 'react-native-reanimated'
import { useTheme } from '@shopify/restyle'
import { Big } from 'big.js'
import dayjs from 'dayjs'

import styles from './styles'
import { BudgetScreenProps } from '@types'
import {
  useGetCategorySpendingHistoryQuery,
  useLazyGetTransactionsQuery,
  selectBudgetMonthYear
} from '@ledget/shared-features'
import { BillCatEmoji, Box, Header, DollarCents, Text, CustomScrollView, Icon, BoxHeader } from '@ledget/native-ui'
import { useAppSelector } from '@hooks'

import SourceSans3Regular from '../../../../assets/fonts/SourceSans3Regular.ttf';
import { ChevronRight } from 'geist-native-icons'

const tempChartData = [
  { date: dayjs().startOf('month').subtract(3, 'month').format('YYYY-MM-DD'), amount_spent: 15 },
  { date: dayjs().startOf('month').subtract(2, 'month').format('YYYY-MM-DD'), amount_spent: 25 },
  { date: dayjs().startOf('month').subtract(1, 'month').format('YYYY-MM-DD'), amount_spent: 20 },
  { date: dayjs().startOf('month').format('YYYY-MM-DD'), amount_spent: 35 },
  { date: dayjs().format('YYYY-MM-DD'), amount_spent: 30 },
]

const windows = [
  { key: '3M', label: '3 Months' },
  { key: '6M', label: '6 Months' },
  { key: '1Y', label: '1 Year' },
  { key: 'ALL', label: 'All' }
]

const Category = (props: BudgetScreenProps<'Category'>) => {
  const [window, setWindow] = useState<typeof windows[number]['key']>(windows[0].key)
  const [chartData, setChartData] = useState(tempChartData);
  const [usingFakeData, setUsingFakeData] = useState(true);
  const { state, isActive } = useChartPressState({ x: '0', y: { amount_spent: 0 } })

  const font = useFont(SourceSans3Regular, 14)
  const theme = useTheme()

  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const { data: fetchedSpendingData } = useGetCategorySpendingHistoryQuery({
    categoryId: props.route.params.category.id,
  })
  const [
    getTransactions,
    { data: transactionsData, isLoading: isLoadingTransactionsData }
  ] = useLazyGetTransactionsQuery();

  const value = useDerivedValue(() => {
    return "$" + `${state.y.amount_spent.value.value}`.split('.')[0];
  }, [state]);

  const textYPosition = useDerivedValue(() => {
    return state.y.amount_spent.position.value - 15;
  }, [value]);

  const textXPosition = useDerivedValue(() => {
    const lastValue = fetchedSpendingData?.[fetchedSpendingData.length - 1]?.amount_spent || 0;
    const firstValue = fetchedSpendingData?.[0]?.amount_spent || 0;
    if (!font) {
      return 0;
    } else if (value.value === `$${Math.floor(lastValue)}`) {
      return state.x.position.value - font.measureText(value.value).width - 4
    } else if (value.value === `$${Math.floor(firstValue)}`) {
      return state.x.position.value + 4;
    }

    return (
      state.x.position.value - font.measureText(value.value).width / 2
    );
  }, [value, font, fetchedSpendingData]);


  // Initial fetching Transactions
  useEffect(() => {
    if (month && year) {
      getTransactions(
        {
          confirmed: true,
          ...(props.route.params.category.period === 'month' ? { month, year } : { year }),
          category: props.route.params.category.id
        },
        true
      );
    }
  }, [month, year]);

  useEffect(() => {
    if ((fetchedSpendingData?.length || 0) > 3) {
      setChartData(fetchedSpendingData?.map((item) => ({
        date: dayjs(`${item.year}-${item.month}-01`).format('MM-DD-YYYY'),
        amount_spent: Big(item.amount_spent).toNumber()
      })) || [])
      setUsingFakeData(false);
    }
  }, [fetchedSpendingData])

  // Fetch more transactions
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // If at the bottom of the scroll view, fetch more transactions
    const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent
    const bottom = contentOffset.y + layoutMeasurement.height >= contentSize.height

    if (bottom && transactionsData?.next !== null && transactionsData) {
      getTransactions({
        confirmed: true,
        ...(props.route.params.category.period === 'month' ? { month, year } : { year }),
        offset: transactionsData.next,
        limit: transactionsData.limit
      });
    }
  };

  return (
    <Box variant='nestedScreen'>
      <View style={styles.header}>
        <View>
          <BillCatEmoji
            emoji={props.route.params.category.emoji}
            period={props.route.params.category.period}
          />
        </View>
        <Header>{props.route.params.category.name.charAt(0).toUpperCase() + props.route.params.category.name.slice(1)}</Header>
      </View>
      <View style={styles.chartContainer}>
        <CartesianChart
          chartPressState={state}
          data={chartData}
          xKey={'date'}
          yKeys={['amount_spent']}
          xAxis={{
            font,
            lineWidth: 0,
            tickCount: window.endsWith('M') ? 4 : 5,
            labelColor:
              !usingFakeData
                ? theme.colors.faintBlueText
                : theme.colors.quaternaryText,
            formatXLabel: (date) => window.endsWith('M')
              ? `      ${dayjs(date).format('MMM')}`
              : `         ${dayjs(date).format('MMM YY')}`,
          }}
          yAxis={[{
            font,
            lineWidth: 0,
            tickCount: 0,
            formatYLabel: () => '',
          }]}
          padding={{ bottom: 24 }}
          domainPadding={{ left: 12, right: 12 }}
          domain={{
            y: [
              chartData.reduce((acc, h) => Math.min(acc, h.amount_spent), 0) * 1.5 -
              (chartData.reduce((acc, h) => Math.max(acc, h.amount_spent), 0) * 1.5
                - chartData.reduce((acc, h) => Math.min(acc, h.amount_spent), 0) * 1.5) * .2,
              chartData.reduce((acc, h) => Math.max(acc, h.amount_spent), 0) * 1.5
            ]
          }}
        >
          {({ points, chartBounds }) => (
            <>
              <Line
                animate={{ type: 'spring', duration: 300 }}
                points={points.amount_spent}
                color={!usingFakeData ? theme.colors.blueChartColor : theme.colors.quinaryText}
                strokeWidth={3}
                curveType='natural'
              />
              <Area
                y0={chartBounds.bottom}
                points={points.amount_spent}
                animate={{ type: 'spring', duration: 300 }}
                curveType='natural'
              >
                <LinearGradient
                  colors={!usingFakeData
                    ? [theme.colors.blueChartGradientStart, theme.colors.mainBackground]
                    : [theme.colors.mediumGrayButton, theme.colors.mainBackground]
                  }
                  start={vec(chartBounds.bottom, 0)}
                  end={vec(chartBounds.bottom, chartBounds.bottom)}
                />
              </Area>
              {usingFakeData && (
                <SkText
                  x={chartBounds.right / 3}
                  y={chartBounds.bottom / 1.375}
                  font={font}
                  color={theme.colors.quinaryText}
                  text='Not enough data yet'
                />
              )}
              {isActive && !usingFakeData && (
                <SkText
                  x={textXPosition}
                  y={textYPosition}
                  font={font}
                  color={theme.colors.blueText}
                  text={value}
                />
              )}
              {isActive && !usingFakeData && (
                <Circle
                  cx={state.x.position}
                  cy={state.y.amount_spent.position}
                  r={3}
                  color={theme.colors.blueText}
                />
              )}
            </>
          )}
        </CartesianChart>
      </View>
      {(transactionsData?.results.length || 0) > 0 &&
        <BoxHeader>
          {dayjs(`${year}-${month}-01`).format('MMM YYYY')}
        </BoxHeader>}
      <Box variant='nestedContainer'>
        <CustomScrollView onScroll={handleScroll} contentContainerStyle={styles.transactionsList}>
          {transactionsData && (
            transactionsData.results.length > 0
              ?
              transactionsData.results.map((transaction) => (
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => props.navigation.navigate('Transaction', { transaction })}>
                  <View>
                    <Text>{transaction.name}</Text>
                    <Text color='tertiaryText'>{dayjs(transaction.date).format('MM-DD-YYYY')}</Text>
                  </View>
                  <View style={styles.amountContainer}>
                    <DollarCents value={Big(transaction.amount).times(100).toNumber()} />
                    <Icon icon={ChevronRight} color='quinaryText' />
                  </View>
                </TouchableOpacity>))
              :
              <View style={styles.emptyListMessage}>
                <Text color='quinaryText'>No spending yet</Text>
              </View>
          )}
        </CustomScrollView>
      </Box>
    </Box>
  )
}
export default Category
