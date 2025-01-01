import { useEffect, useState } from 'react';
import { useTheme } from '@shopify/restyle';
import { View } from 'react-native';
import { CartesianChart, Area, Line, useChartPressState } from 'victory-native';
import { LinearGradient, vec, useFont, Text as SkText } from '@shopify/react-native-skia';
import Animated, { useAnimatedStyle, useSharedValue, useAnimatedReaction, runOnJS } from 'react-native-reanimated';
import { SlotText } from 'react-native-slot-text';
import dayjs from 'dayjs';

import styles from './styles/chart-skeleton';
import { VictoryTooltip, Box } from '@ledget/native-ui';
import { tempInvestmentsBalanceChartData } from '@constants';
import SourceSans3Regular from '../../../../../../assets/fonts/SourceSans3Regular.ttf'

export const tempChartData = tempInvestmentsBalanceChartData.map((d, i) => ({
  date: dayjs().subtract(i, 'days').format('YYYY-MM-DD'),
  balance: d
})).reverse();

export type ChartDataT = typeof tempChartData

interface Props {
  data?: {
    date: string,
    balance: number,
  }[]
  emptyMessage: boolean
}

const Chart = (props: Props) => {
  const theme = useTheme();
  const { state, isActive } = useChartPressState({ x: '0', y: { balance: 0 } })
  const font = useFont(SourceSans3Regular, 14)
  const tempFont = useFont(SourceSans3Regular, 13)
  const tipOpacity = useSharedValue(0);
  const [chartData, setChartData] = useState(tempChartData);
  const [slotsValue, setSlotsValue] = useState<number>(0);

  useAnimatedReaction(() => state.y.balance.value.value, (value) => {
    const newValue = parseInt(`${value}`.split('.')[0]);
    runOnJS(setSlotsValue)(newValue);
  });

  useAnimatedReaction(() => isActive, (active) => {
    if (props.data) {
      tipOpacity.value = active ? 1 : 0;
    }
  });

  useEffect(() => {
    if (props.data) {
      setChartData(props.data)
    }
  }, [props.data]);

  const tipStyle = useAnimatedStyle(() => ({ opacity: tipOpacity.value }));

  return (
    <View style={styles.chartContainer}>
      <View style={styles.tipContainer}>
        <Animated.View style={[styles.tip, tipStyle]}>
          <Box
            backgroundColor='nestedContainerSeperator'
            paddingHorizontal='s'
            paddingVertical='xs'
            borderRadius='s'
            shadowColor='mainText'
            shadowOpacity={.3}
            shadowRadius={5}
            shadowOffset={{ width: 0, height: 0 }}
          >
            <SlotText
              fontStyle={[
                { color: theme.colors.mainText },
                styles.fontStyle
              ]}
              easing='in-out'
              prefix='$'
              value={slotsValue}
              animationDuration={200}
              includeComma={true}
            />
          </Box>
        </Animated.View>
      </View>
      <CartesianChart
        data={chartData}
        xKey={'date'}
        yKeys={['balance']}
        chartPressState={state}
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
              animate={{ type: 'timing', duration: 300 }}
              curveType='natural'
            >
              <LinearGradient
                colors={props.data
                  ? [
                    theme.colors.blueChartGradientStart,
                    theme.colors.blueChartGradientStart,
                    theme.colors.nestedContainer
                  ]
                  : [
                    theme.colors.emptyChartGradientStart,
                    theme.colors.nestedContainer
                  ]
                }
                start={vec(chartBounds.bottom, 0)}
                end={vec(chartBounds.bottom, chartBounds.bottom)}
              />
            </Area>
            <Line
              animate={{ type: 'timing', duration: 300 }}
              points={points.balance}
              color={theme.colors.quinaryText}
              strokeWidth={2}
              strokeCap='round'
              curveType='natural'
            />
            <Line
              animate={{ type: 'timing', duration: 300 }}
              points={points.balance}
              color={props.data ? theme.colors.blueChartColor : theme.colors.quinaryText}
              strokeWidth={2}
              strokeCap='round'
              curveType='natural'
            />
            {!props.data && props.emptyMessage &&
              <SkText
                text={`not enough data yet`}
                font={tempFont}
                color={theme.colors.quinaryText}
                x={(chartBounds.right / 2) - ((tempFont?.measureText('not enough data yet')?.width || 0) / 2)}
                y={chartBounds.bottom - 8}
              />
            }
            {isActive && props.data && (
              <VictoryTooltip
                state={state}
                isActive={state.isActive}
                font={font}
                chartBounds={chartBounds}
                xAxisTipColor={theme.colors.tertiaryText}
                dotColor={theme.colors.blueText}
                borderColor={theme.colors.blueChartColor}
                backgroundColor={theme.colors.tooltip}
                color={theme.colors.whiteText}
                lineOffset={-20}
              />)}
          </>
        )}
      </CartesianChart>
    </View>
  )
}
export default Chart
