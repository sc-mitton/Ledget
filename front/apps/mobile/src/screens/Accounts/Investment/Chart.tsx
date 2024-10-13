import { useState } from 'react';
import { View } from 'react-native'
import { CartesianChart, Area, Line, useChartPressState } from 'victory-native';
import {
  LinearGradient,
  useFont,
  vec,
} from '@shopify/react-native-skia';
import { useTheme } from '@shopify/restyle';
import dayjs from 'dayjs';

import styles from './styles/chart';
import SourceSans3Regular from '../../../../assets/fonts/SourceSans3Regular.ttf';
import tempDataValues from './tempChartData';
import { VictoryTooltip } from '@ledget/native-ui';

const tempChartData = tempDataValues.map((d, i) => ({
  date: dayjs().subtract(i, 'days').format('YYYY-MM-DD'),
  balance: d
})).reverse();

const windows = [
  { key: '1W', label: '1 Week', format: 'MMM D', ticks: 3 },
  { key: '1M', label: '1 Month', format: 'MMM D', ticks: 5 },
  { key: '6M', label: '6 Months', format: 'MMM', ticks: 5 },
  { key: '1Y', label: '1 Year', format: 'MMM YY', ticks: 5 },
  { key: 'ALL', label: 'All', format: 'MMM YY', ticks: 5 },
] as const;

const BOTTOM_PADDING = 100

const Chart = ({ data }: { data?: { date: string, balance: number }[] }) => {
  const [window, setWindow] = useState<typeof windows[number]['key']>(windows[0].key)
  const chartData = data || tempChartData

  const font = useFont(SourceSans3Regular, 14)
  const theme = useTheme()
  const { state, isActive } = useChartPressState({ x: '0', y: { balance: 0 } })

  return (
    <View style={styles.chartContainer}>
      <CartesianChart
        chartPressState={state}
        data={chartData}
        xKey={'date'}
        yKeys={['balance']}
        xAxis={{
          font,
          lineWidth: 0,
          labelOffset: -20,
          tickCount: data ? windows.find(w => w.key === window)?.ticks || 3 : 5,
          labelColor:
            data
              ? theme.colors.faintBlueText
              : theme.colors.quaternaryText,
          formatXLabel: (date) =>
            `            ${dayjs(date).format(windows.find(w => w.key === window)?.format || 'MMM D')}`,
        }}
        yAxis={[{
          font,
          lineWidth: 0,
          tickCount: 0,
          formatYLabel: () => '',
        }]}
        padding={{ left: 0 }}
        domainPadding={{ left: 6, right: 6, top: 50, bottom: BOTTOM_PADDING }}
      >
        {({ points, chartBounds }) => (
          <>
            <Area
              y0={chartBounds.bottom}
              points={points.balance}
              animate={{ type: 'spring', duration: 300 }}
              curveType='natural'
            >
              <LinearGradient
                colors={data
                  ? [
                    theme.colors.blueChartGradientStart,
                    theme.colors.blueChartGradientStart,
                    theme.colors.blueChartGradientEnd
                  ]
                  : [
                    theme.colors.emptyChartGradientStart,
                    theme.colors.blueChartGradientEnd
                  ]
                }
                start={vec(chartBounds.bottom, 0)}
                end={vec(chartBounds.bottom, chartBounds.bottom)}
              />
            </Area>
            <Line
              animate={{ type: 'spring', duration: 300 }}
              points={points.balance}
              color={data ? theme.colors.blueChartColor : theme.colors.quinaryText}
              strokeWidth={2}
              strokeCap='round'
              curveType='natural'
            />
            {isActive && data && (
              <VictoryTooltip
                state={state}
                font={font}
                chartBounds={chartBounds}
                color={theme.colors.mainText}
                dotColor={theme.colors.blueText}
                borderColor={theme.colors.lightBlueButton}
                backgroundColor={theme.colors.grayButton}
                verticalCrosshair={true}
                lineOffset={-20}
              />)}
          </>
        )}
      </CartesianChart>
    </View>
  )
}

export default Chart;
