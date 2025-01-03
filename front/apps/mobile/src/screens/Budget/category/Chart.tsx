import { useState, useEffect } from 'react';
import { CartesianChart, Area, Line, useChartPressState } from 'victory-native';
import {
  useFont,
  Text as SkText,
  Circle,
  LinearGradient,
  vec,
} from '@shopify/react-native-skia';
import { View } from 'react-native';
import { useDerivedValue } from 'react-native-reanimated';
import { useTheme } from '@shopify/restyle';
import dayjs from 'dayjs';

import styles from './styles/chart';
import {
  useGetCategorySpendingHistoryQuery,
  Category,
} from '@ledget/shared-features';

import SourceSans3Regular from '../../../../assets/fonts/SourceSans3Regular.ttf';

const windows = [
  { key: '3M', label: '3 Months' },
  { key: '6M', label: '6 Months' },
  { key: '1Y', label: '1 Year' },
  { key: 'ALL', label: 'All' },
];

interface Props {
  category: Category;
  data?: {
    date: string;
    amount_spent: number;
  }[];
  notEnoughData: boolean;
}

const tempChartData = [
  {
    date: dayjs().startOf('month').subtract(3, 'month').format('YYYY-MM-DD'),
    amount_spent: 15,
  },
  {
    date: dayjs().startOf('month').subtract(2, 'month').format('YYYY-MM-DD'),
    amount_spent: 25,
  },
  {
    date: dayjs().startOf('month').subtract(1, 'month').format('YYYY-MM-DD'),
    amount_spent: 20,
  },
  { date: dayjs().startOf('month').format('YYYY-MM-DD'), amount_spent: 35 },
  { date: dayjs().format('YYYY-MM-DD'), amount_spent: 30 },
];

const Chart = (props: Props) => {
  const [window, setWindow] = useState<(typeof windows)[number]['key']>(
    windows[0].key
  );
  const { state, isActive } = useChartPressState({
    x: '0',
    y: { amount_spent: 0 },
  });
  const [xLabelFormat, setXLabelFormat] = useState('');
  const [chartData, setChartData] = useState(tempChartData);
  const [usingTempData, setUsingTempData] = useState(true);

  const font = useFont(SourceSans3Regular, 14);
  const theme = useTheme();

  const { data: fetchedSpendingData } = useGetCategorySpendingHistoryQuery({
    categoryId: props.category.id,
  });

  const value = useDerivedValue(() => {
    return '$' + `${state.y.amount_spent.value.value}`.split('.')[0];
  }, [state]);

  const textYPosition = useDerivedValue(() => {
    return state.y.amount_spent.position.value - 15;
  }, [value]);

  const textXPosition = useDerivedValue(() => {
    const lastValue =
      fetchedSpendingData?.[fetchedSpendingData.length - 1]?.amount_spent || 0;
    const firstValue = fetchedSpendingData?.[0]?.amount_spent || 0;
    if (!font) {
      return 0;
    } else if (value.value === `$${Math.floor(lastValue)}`) {
      return state.x.position.value - font.measureText(value.value).width - 4;
    } else if (value.value === `$${Math.floor(firstValue)}`) {
      return state.x.position.value + 4;
    }

    return state.x.position.value - font.measureText(value.value).width / 2;
  }, [value, font, fetchedSpendingData]);

  useEffect(() => {
    if (props.data && props.data.length > 1) {
      setChartData(props.data);
      setUsingTempData(false);
    }
  }, [props.data]);

  useEffect(() => {
    const numberOfMonths = dayjs(props.data?.[0]?.date).diff(
      dayjs(props.data?.[props.data.length - 1]?.date),
      'month'
    );
    if (numberOfMonths > 6) {
      setXLabelFormat('MMM YYYY');
    } else {
      setXLabelFormat('MMM');
    }
  }, [chartData]);

  return (
    <View style={styles.chartContainer}>
      <CartesianChart
        chartPressState={state}
        data={chartData}
        xKey={'date'}
        yKeys={['amount_spent']}
        xAxis={{
          font,
          lineWidth: 0,
          labelColor: !usingTempData
            ? theme.colors.faintBlueText
            : theme.colors.quaternaryText,
          formatXLabel: (date) =>
            dayjs(date).isSame(chartData[0].date, 'month')
              ? ''
              : dayjs(date).format(xLabelFormat),
          tickCount: 5,
        }}
        yAxis={[
          {
            font,
            lineWidth: 0,
            tickCount: 0,
            formatYLabel: () => '',
          },
        ]}
        padding={{ bottom: 24 }}
        domainPadding={{ left: 6, right: 6 }}
        domain={{
          y: [
            chartData.reduce((acc, h) => Math.min(acc, h.amount_spent), 0) *
              1.5 -
              (chartData.reduce((acc, h) => Math.max(acc, h.amount_spent), 0) *
                1.5 -
                chartData.reduce((acc, h) => Math.min(acc, h.amount_spent), 0) *
                  1.5) *
                0.2,
            chartData.reduce((acc, h) => Math.max(acc, h.amount_spent), 0) *
              1.5,
          ],
        }}
      >
        {({ points, chartBounds }) => (
          <>
            <Line
              animate={{ type: 'spring', duration: 300 }}
              points={points.amount_spent}
              color={
                !usingTempData
                  ? theme.colors.blueChartColor
                  : theme.colors.quaternaryText
              }
              strokeWidth={3}
              curveType="linear"
            />
            <Area
              y0={chartBounds.bottom}
              points={points.amount_spent}
              animate={{ type: 'spring', duration: 300 }}
              curveType="linear"
            >
              <LinearGradient
                colors={
                  !usingTempData
                    ? [
                        theme.colors.blueChartGradientStart,
                        theme.colors.mainBackground,
                      ]
                    : [
                        theme.colors.emptyChartGradientStart,
                        theme.colors.mainBackground,
                      ]
                }
                start={vec(chartBounds.bottom, 0)}
                end={vec(chartBounds.bottom, chartBounds.bottom)}
              />
            </Area>
            {usingTempData && props.notEnoughData && (
              <SkText
                x={chartBounds.right / 3}
                y={chartBounds.bottom / 1.375}
                font={font}
                color={theme.colors.quinaryText}
                text="Not enough data yet"
              />
            )}
            {isActive && !usingTempData && (
              <SkText
                x={textXPosition}
                y={textYPosition}
                font={font}
                color={theme.colors.blueText}
                text={value}
              />
            )}
            {isActive && !usingTempData && (
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
  );
};
export default Chart;
