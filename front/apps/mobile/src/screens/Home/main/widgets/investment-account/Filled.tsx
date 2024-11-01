import { useMemo } from "react";
import { View } from "react-native"
import Big from 'big.js'
import dayjs from 'dayjs'
import { ArrowUpRight, ArrowDownRight } from 'geist-native-icons';

import styles from './styles/filled'
import { Icon, Text, InstitutionLogo, DollarCents, Button, Box, PulseBox } from "@ledget/native-ui"
import {
  useLazyGetInvestmendsBalanceHistoryQuery,
  useGetInvestmentsQuery,
  isInvestmentSupported,
  InvestmentWithProductSupport
} from "@ledget/shared-features"
import Chart from './Chart'
import { Fragment, useEffect, useState } from "react"
import { windows } from "./constants"
import { Props } from "./types"
import { useAppDispatch } from "@hooks"
import { updateWidget } from "@features/widgetsSlice"
import type { ChartDataT } from './Chart'

const Filled = (props: Props) => {
  const [window, setWindow] = useState<typeof windows[number]>(props.args?.window || windows[0])
  const [investment, setInvestment] = useState<InvestmentWithProductSupport>()


  const dispatch = useAppDispatch()

  const { data: investments } = useGetInvestmentsQuery({
    end: dayjs().format('YYYY-MM-DD'),
    start: dayjs().subtract(window.amount || 100, window.period).format('YYYY-MM-DD')
  }, {
    skip: !props.args?.window
  })
  const [getBalanceHistory, { data: history }] = useLazyGetInvestmendsBalanceHistoryQuery()
  const [chartData, setChartData] = useState<ChartDataT>()

  const percentChange = useMemo(() => {
    if (!history || (history[0]?.balances?.length || 0) < 2) return

    return Big(history[0].balances[1].balance)
      .minus(Big(history[0].balances[2].balance))
      .div(Big(history[0].balances[2].balance))
      .times(100)
      .toNumber()

  }, [history])

  useEffect(() => {
    if (props.args?.investment && window) {
      getBalanceHistory({
        end: dayjs().format('YYYY-MM-DD'),
        start: dayjs().subtract(window.amount || 100, window.period).format('YYYY-MM-DD'),
        accounts: [props.args.investment]
      }, true)
    }
  }, [props.args?.investment, window])

  useEffect(() => {
    dispatch(updateWidget({ widget: { ...props, args: { window, ...props.args } } }))
  }, [window])

  useEffect(() => {
    if (!investments) return
    setInvestment(investments.results
      .filter(i => isInvestmentSupported(i))
      .find(i => i.account_id === props.args?.investment)
    )
  }, [investments])

  useEffect(() => {
    if (!history || (history[0]?.balances?.length || 0) < 7) return
    setChartData(history[0].balances)
  }, [history])

  return (
    <View style={styles.container}>
      <View style={[props.shape === 'square' ? styles.squareTitleContainer : styles.rectangleTitleContainer]}>
        <View style={[props.shape === 'square' ? styles.squareTitle : styles.rectangleTitle]}>
          <View>
            <InstitutionLogo account={props.args?.investment} size={props.shape === 'rectangle' ? 20 : 16} />
          </View>
          {investment?.account_name
            ?
            <Text
              color='secondaryText'
              fontSize={props.shape === 'rectangle' ? 15 : 13}
              lineHeight={props.shape === 'rectangle' ? 22 : 18}
            >
              {investment?.account_name}
            </Text>
            : <Box marginBottom='xs'><PulseBox width={70} height={'reg'} /></Box>}
        </View>
        <View style={styles.amountContainer}>
          <DollarCents
            value={Big(investment?.balance || 0).times(100).toNumber()}
            fontSize={15}
            lineHeight={22}
            withCents={props.shape === 'rectangle'}
          />
          {percentChange !== undefined &&
            <View style={styles.percent}>
              <Text fontSize={15} color={percentChange > 0 ? 'greenText' : 'alert'}>
                {`${2}%`}
              </Text>
              {percentChange > 0
                ? <Icon icon={ArrowUpRight} size={15} color='greenText' />
                : <Icon icon={ArrowDownRight} size={15} color='alert' />}
            </View>
          }
        </View>
      </View>
      <Chart data={chartData} />
      <View style={styles.windowButtons}>
        {windows.map((w, i) => (
          <Fragment key={`investment-widget-${w.key}`}>
            {i !== 0 && <Box variant='divider' backgroundColor="nestedContainerSeperator" />}
            <Button
              label={w.key}
              fontSize={13}
              padding='none'
              textColor={window.key === w.key ? 'mainText' : 'tertiaryText'}
              onPress={() => setWindow(w)}
            />
          </Fragment>
        ))}
      </View>
    </View>
  )
}

export default Filled
