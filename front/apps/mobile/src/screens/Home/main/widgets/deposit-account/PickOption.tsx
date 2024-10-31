import { View } from 'react-native';
import { CartesianChart, Area, Line } from 'victory-native';
import {
  LinearGradient,
  vec
} from '@shopify/react-native-skia';
import { useTheme } from '@shopify/restyle';

import { tempDepositBalanceChartData } from '@constants'
import styles from './styles/pick-option';
import { Box, InstitutionLogo } from '@ledget/native-ui';
import { useGetAccountsQuery } from '@ledget/shared-features';

const Shadow = () => {
  const { data: accounts } = useGetAccountsQuery();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <InstitutionLogo
          institution={accounts?.institutions[0].id}
          size={16}
        />
        <View style={styles.rightContainer}>
          <Box
            backgroundColor='transactionShimmer'
            style={styles.nameSkeleton}
            borderRadius='xxs'
          />
          <Box
            backgroundColor='transactionShimmer'
            style={styles.amountSkeleton}
            borderRadius='xxs'
          />
        </View>
      </View>
      <View style={styles.chartContainer}>
        <CartesianChart
          data={tempDepositBalanceChartData}
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
          domainPadding={{ left: 6, right: 6, top: 20, bottom: 100 }}
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
                    theme.colors.emptyChartGradientStart,
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
            </>
          )}
        </CartesianChart>
      </View>
    </View>
  )
}
export default Shadow
