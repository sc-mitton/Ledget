import { Fragment } from 'react'
import dayjs from 'dayjs'
import { ArrowUpRight, ArrowDownRight, ChevronRight } from 'geist-native-icons'
import Big from 'big.js'

import styles from './styles/holdings';
import { View } from "react-native";
import { useAppSelector } from '@/hooks';
import { Box, CustomScrollView, Icon, Text, Button, DollarCents } from '@ledget/native-ui';
import { selectInvestmentsScreenAccounts, selectInvestmentsScreenWindow } from '@/features/uiSlice';
import { useGetInvestmentsQuery, isInvestmentSupported, Holding } from '@ledget/shared-features';
import { AccountsTabsScreenProps } from '@types';
import Skeleton from './Skeleton';

const Holdings = (props: AccountsTabsScreenProps<'Investment'>) => {
  const window = useAppSelector(selectInvestmentsScreenWindow)
  const { data: investmentsData } = useGetInvestmentsQuery({
    end: dayjs().format('YYYY-MM-DD'),
    start: dayjs().subtract(window?.amount || 100, window?.period || 'year').format('YYYY-MM-DD')
  }, {
    skip: !window
  })
  const accounts = useAppSelector(selectInvestmentsScreenAccounts)

  return (
    <View style={styles.container}>
      <Box style={styles.header}>
        <Button
          label='Holdings'
          textColor='tertiaryText'
          labelPlacement='left'
          padding='none'
          onPress={() => {
            props.navigation.navigate('Modals', { screen: 'Holdings' })
          }}
          icon={<Icon icon={ChevronRight} size={16} color='quaternaryText' />}
        />
      </Box>
      {investmentsData
        ?
        <Box variant='nestedContainer'>
          <CustomScrollView
            contentContainerStyle={styles.holdings}
            horizontal>
            {investmentsData?.reduce((acc, i) => {
              if ((!accounts || accounts?.some(a => a.id === i.account_id)) && isInvestmentSupported(i)) {
                acc.push(...i.holdings)
              }
              return acc
            }, [] as Holding[]).map((holding, index) => (
              <Fragment key={`$holding-${index}`}>
                {index !== 0 && <Box variant='divider' backgroundColor='nestedContainerSeperator' />}
                <Box style={styles.holding} >
                  <View style={styles.holdingTitle}>
                    <Text fontSize={14} color='secondaryText'>
                      {
                        holding.security.ticker_symbol
                          ? holding.security.ticker_symbol?.slice(0, 6)
                          : '—'}
                    </Text>
                    <Text color='redText' fontSize={14}>
                      {/* Percent here */}
                    </Text>
                    {/* <Icon icon={ArrowDownRight} size={14} color='redText' strokeWidth={2} /> */}
                  </View>
                  {holding.institution_value &&
                    <DollarCents
                      variant='bold'
                      value={Big(holding.institution_value).times(100).toNumber()}
                    />}
                </Box>
              </Fragment>
            ))
            }
          </CustomScrollView>
        </Box>
        :
        <Skeleton />
      }
    </View>
  )
}

export default Holdings;
