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
import dayjs from 'dayjs';

interface ChartProps { data?: typeof tempDepositBalanceChartData }

const Chart = (props: ChartProps) => {
  const theme = useTheme();
  const font = useFont(SourceSans3Regular, 14)

  const [chartData, setChartData] = useState(tempDepositBalanceChartData)
  const [usingTempData, setUsingTempData] = useState(true)
  const [xLabelFormat, setXLabelFormat] = useState('')
  const { state } = useChartPressState({ x: '0', y: { balance: 0 } })

  useEffect(() => {
    if (props.data && props.data.length > 1) {
      setChartData(props.data)
      setUsingTempData(false)
    }
  }, [props.data])

  useEffect(() => {
    const numberOfMonths = dayjs(props.data?.[0]?.date).diff(dayjs(props.data?.[props.data.length - 1]?.date), 'month')
    if (numberOfMonths > 6) {
      setXLabelFormat('MMM YYYY')
    } else {
      setXLabelFormat('MMM')
    }
  }, [chartData])

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
        labelColor:
          usingTempData
            ? theme.colors.transparent
            : theme.colors.faintBlueText,
        formatXLabel: (date) => {
          return date === undefined
            ? ''
            : dayjs(date).isSame(chartData[0].date, 'month')
              ? ' '.repeat(16) + `${dayjs(date).format(xLabelFormat)}`
              : dayjs(date).isSame(chartData[chartData.length - 1].date)
                ? ''
                : dayjs(date).format(xLabelFormat)
        },
        tickCount: 5
      }}
      yAxis={[{
        font,
        lineWidth: 0,
        tickCount: 0,
        formatYLabel: () => '',
      }]}
      padding={{ left: 0, bottom: 20, right: -48 }}
      domainPadding={{ top: 65, bottom: 100, right: 48 }}
    >
      {({ points, chartBounds, xScale }) => {
        return (
          <>
            <Area
              y0={chartBounds.bottom}
              points={points.balance}
              animate={{ type: 'spring', duration: 300 }}
              curveType='linear'
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
              points={points.balance.slice(0, undefined)}
              color={usingTempData ? theme.colors.quinaryText : theme.colors.blueChartColor}
              strokeWidth={2}
              strokeCap='round'
              curveType='linear'
            />
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
              hidden={['verticalCrossHair', 'xTip']}
            />
          </>
        )
      }}
    </CartesianChart>
  )
}

export default Chart
