import { useTheme } from '@shopify/restyle';
import { View } from 'react-native';
import { CartesianChart, Area, Line, useChartPressState } from 'victory-native';
import { LinearGradient, vec, useFont } from '@shopify/react-native-skia';
import dayjs from 'dayjs';

import styles from './styles/chart-skeleton';
import { VictoryTooltip } from '@ledget/native-ui';
import { tempDepositBalanceChartData } from '@constants';
import SourceSans3Regular from '../../../../../../assets/fonts/SourceSans3Regular.ttf'

interface Props {
  data?: {
    date: string,
    balance: number,
  }[]
}

const ChartSkeleton = (props: Props) => {
  const theme = useTheme();
  const { state, isActive } = useChartPressState({ x: '0', y: { balance: 0 } })
  const font = useFont(SourceSans3Regular, 14)

  return (
    <View style={styles.chartContainer}>
      <CartesianChart
        chartPressState={state}
        data={props.data || tempDepositBalanceChartData}
        xKey={'date'}
        yKeys={['balance']}
        xAxis={{
          lineWidth: 0,
          labelOffset: -20,
          tickCount: 0,
          labelColor: theme.colors.quaternaryText,
          formatXLabel: (date) => ''
        }}
        yAxis={[{
          lineWidth: 0,
          tickCount: 0,
          formatYLabel: () => '',
        }]}
        padding={{ left: 0 }}
        domainPadding={{ left: 6, right: 6, top: 20, bottom: 45 }}
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
                colors={[
                  props.data ? theme.colors.blueChartColor : theme.colors.emptyChartGradientStart,
                  theme.colors.blueChartGradientEnd
                ]}
                start={vec(chartBounds.bottom, 0)}
                end={vec(chartBounds.bottom, chartBounds.bottom)}
              />
            </Area>
            <Line
              animate={{ type: 'spring', duration: 300 }}
              points={points.balance}
              color={theme.colors.quinaryText}
              strokeWidth={2}
              strokeCap='round'
              curveType='natural'
            />
            <Line
              animate={{ type: 'spring', duration: 300 }}
              points={points.balance}
              color={props.data ? theme.colors.blueChartColorSecondary : theme.colors.quinaryText}
              strokeWidth={2}
              strokeCap='round'
              curveType='natural'
            />
            {isActive && props.data && (
              <VictoryTooltip
                state={state}
                font={font}
                chartBounds={chartBounds}
                color={theme.colors.mainText}
                xAxisTipColor={theme.colors.tertiaryText}
                dotColor={theme.colors.blueText}
                borderColor={theme.colors.lightBlueButton}
                backgroundColor={theme.colors.grayButton}
                verticalCrosshair={true}
                lineOffset={-20}
                xAxisTip={true}
              />)}
          </>
        )}
      </CartesianChart>
    </View>
  )
}
export default ChartSkeleton
