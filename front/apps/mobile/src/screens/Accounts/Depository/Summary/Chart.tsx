import { useEffect, useState } from 'react';
import { CartesianChart, Area, Line, useChartPressState } from 'victory-native';
import {
  LinearGradient,
  useFont,
  vec
} from '@shopify/react-native-skia';
import { useTheme } from '@shopify/restyle';

import { tempDepositBalanceChartData } from '@constants';
import { VictoryTooltip } from '@ledget/native-ui';
import SourceSans3Regular from '../../../../../assets/fonts/SourceSans3Regular.ttf';

interface ChartProps {
  data?: typeof tempDepositBalanceChartData
  tickCount: number
  xLabelFormat: (date: string) => string
}

const Chart = (props: ChartProps) => {
  const theme = useTheme();
  const font = useFont(SourceSans3Regular, 14)

  const [chartData, setChartData] = useState(tempDepositBalanceChartData)
  const [usingTempData, setUsingTempData] = useState(true)
  const { state } = useChartPressState({ x: '0', y: { balance: 0 } })

  useEffect(() => {
    if (props.data && props.data.length > 1) {
      setChartData(props.data)
      setUsingTempData(false)
    }
  }, [props.data])

  return (
    <CartesianChart
      chartPressState={state}
      data={chartData}
      xKey={'date'}
      yKeys={['balance']}
      xAxis={{
        font,
        lineWidth: 0,
        labelOffset: -20,
        tickCount: props.tickCount,
        labelColor:
          usingTempData
            ? theme.colors.transparent
            : theme.colors.faintBlueText,
        formatXLabel: props.xLabelFormat,
      }}
      yAxis={[{
        font,
        lineWidth: 0,
        tickCount: 0,
        formatYLabel: () => '',
      }]}
      padding={{ left: 0, bottom: 24 }}
      domainPadding={{ left: 3, right: 3, top: 50, bottom: 100 }}
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
              colors={usingTempData
                ? [
                  theme.colors.emptyChartGradientStart,
                  theme.colors.mainBackground
                ]
                : [
                  theme.colors.blueChartGradientStart,
                  theme.colors.blueChartGradientStart,
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
            color={usingTempData ? theme.colors.quinaryText : theme.colors.blueChartColor}
            strokeWidth={2}
            strokeCap='round'
            curveType='natural'
          />
          <VictoryTooltip
            state={state}
            isActive={state.isActive}
            font={font}
            chartBounds={chartBounds}
            color={theme.colors.mainText}
            xAxisTipColor={theme.colors.tertiaryText}
            dotColor={theme.colors.blueText}
            borderColor={theme.colors.blueChartColor}
            backgroundColor={theme.colors.nestedContainerSeperator}
            lineOffset={-20}
            hidden={['verticalCrossHair', 'xTip']}
          />
        </>
      )}
    </CartesianChart>
  )
}

export default Chart
