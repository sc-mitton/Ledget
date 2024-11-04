import { Fragment, useEffect, useState } from 'react'
import { View } from 'react-native'
import Big from 'big.js'
import dayjs from 'dayjs'

import styles from './styles/filled'
import { WidgetProps } from '@/features/widgetsSlice'
import { windows } from "./constants"
import { tempDepositBalanceChartData } from '@constants'
import { Button, Box, InstitutionLogo, Text, DollarCents, PulseBox } from '@ledget/native-ui'
import Chart from './Chart'
import { Account, useGetAccountsQuery, useLazyGetAccountBalanceHistoryQuery } from '@ledget/shared-features'

const Filled = (props: WidgetProps<{ account: string }>) => {
  const [window, setWindow] = useState<typeof windows[number]['key']>(windows[0].key)
  const [account, setAccount] = useState<Account>()
  const [dateWindow, setDateWindow] = useState<{ start: number, end: number }>({ start: 0, end: 0 })
  const { data: accountsData } = useGetAccountsQuery()
  const [getBalanceHistory, { data: balanceHistoryData, isFetching }] = useLazyGetAccountBalanceHistoryQuery()
  const [balanceHistoryChartData, setBalanceHistoryChartData] = useState<typeof tempDepositBalanceChartData>()

  useEffect(() => {
    if (isFetching) {
      setBalanceHistoryChartData(undefined)
    }
  }, [isFetching])

  useEffect(() => {
    if (balanceHistoryData) {
      const chartData = balanceHistoryData
        .find(a => a.account_id === props.args?.account)
        ?.history
        ?.map(d => ({ balance: d.balance, date: dayjs(d.month).format('YYYY-MM-DD') }))
        .reverse()
      if (!chartData || chartData.length < 2) {
        return
      }
      setBalanceHistoryChartData(chartData);
    }
  }, [balanceHistoryData])

  useEffect(() => {
    if (accountsData) {
      setAccount(accountsData.accounts.find(a => a.id === props.args?.account))
    }
  }, [accountsData])

  useEffect(() => {
    if (dateWindow.start && dateWindow.end && accountsData && account) {
      getBalanceHistory({
        start: dateWindow.start,
        end: dateWindow.end,
        type: account.type as any,
        accounts: [account.id],
      }, true);
    }
  }, [accountsData, dateWindow, account])

  useEffect(() => {
    switch (window) {
      case '3M':
        setDateWindow({
          start: dayjs().startOf('day').subtract(3, 'month').unix(),
          end: dayjs().startOf('day').unix()
        });
        break;
      case '6M':
        setDateWindow({
          start: dayjs().startOf('day').subtract(6, 'month').unix(),
          end: dayjs().startOf('day').unix()
        });
        break;
      case 'ALL':
        setDateWindow({
          start: dayjs().startOf('day').subtract(10, 'year').unix(),
          end: dayjs().startOf('day').unix()
        });
        break;
    }
  }, [window]);

  return (
    <View style={styles.container}>
      <View style={[props.shape === 'square' ? styles.squareTitleContainer : styles.rectangleTitleContainer]}>
        <View style={[props.shape === 'square' ? styles.squareTitle : styles.rectangleTitle]}>
          <View>
            <InstitutionLogo account={props.args?.account} size={props.shape === 'rectangle' ? 20 : 16} />
          </View>
          {account?.name
            ?
            <Text
              color='secondaryText'
              fontSize={props.shape === 'rectangle' ? 15 : 13}
              lineHeight={props.shape === 'rectangle' ? 22 : 18}
            >
              {account?.name}
            </Text>
            : <Box marginBottom='xs'><PulseBox width={70} height={'reg'} /></Box>}
        </View>
        <DollarCents
          value={Big(account?.balances.current || 0).times(100).toNumber()}
          fontSize={15}
          lineHeight={22}
          withCents={props.shape === 'rectangle'}
        />
      </View>
      <Chart data={balanceHistoryChartData} />
      <View style={styles.windowButtons}>
        {windows.map((w, i) => (
          <Fragment key={`investment-widget-${w.key}`}>
            {i !== 0 && <Box variant='divider' backgroundColor="nestedContainerSeperator" />}
            <Button
              label={w.key}
              fontSize={13}
              padding='none'
              textColor={window === w.key ? 'mainText' : 'tertiaryText'}
              onPress={() => setWindow(w.key)}
            />
          </Fragment>
        ))}
      </View>
    </View>
  )
}

export default Filled
