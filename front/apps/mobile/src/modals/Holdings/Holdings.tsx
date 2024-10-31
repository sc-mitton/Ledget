import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { ArrowUp, ArrowDown } from 'geist-native-icons';

import styles from './styles/holdings';
import { ModalScreenProps } from '@types';
import { Box, Button, Header2, Seperator, Icon, CustomScrollView } from '@ledget/native-ui';
import { useAppSelector } from '@/hooks';
import { useGetInvestmentsQuery, isInvestmentSupported, Holding } from '@ledget/shared-features';
import { selectInvestmentsScreenAccounts, selectInvestmentsScreenWindow, selectPinnedHoldings } from '@/features/uiSlice';
import Row from './Row';

const AccountPicker = (props: ModalScreenProps<'Holdings'>) => {
  const accounts = useAppSelector(selectInvestmentsScreenAccounts);
  const window = useAppSelector(selectInvestmentsScreenWindow)
  const pinnedHoldings = useAppSelector(selectPinnedHoldings)

  const [holdings, setHoldings] = useState<(Holding & { account: string })[]>()
  const [sort, setSort] = useState<'amountDesc' | 'amountAsc' | 'nameDesc' | 'nameAsc' | 'default'>('default')

  const { data: investmentsData } = useGetInvestmentsQuery({
    end: dayjs().format('YYYY-MM-DD'),
    start: dayjs().subtract(window?.amount || 100, window?.period || 'year').format('YYYY-MM-DD')
  }, {
    skip: !window
  })

  useEffect(() => {
    const newHoldings = investmentsData?.results.reduce(
      (acc, i) => {
        if (isInvestmentSupported(i) && (!accounts || accounts?.some(a => a.id === i.account_id))) {
          return acc.concat(i.holdings.map(h => ({ ...h, account: i.account_id })))
        }
        return acc
      }, [] as (Holding & { account: string })[]
    ).sort((a, b) => {
      if (pinnedHoldings?.includes(a.security_id || '') && !pinnedHoldings?.includes(b.security_id || '')) {
        return -1
      } else if (!pinnedHoldings?.includes(a.security_id || '') && pinnedHoldings?.includes(b.security_id || '')) {
        return 1
      } else if (sort === 'amountAsc') {
        return (a.institution_value || Number.MAX_SAFE_INTEGER) - (b.institution_value || Number.MAX_SAFE_INTEGER)
      } else if (sort === 'amountDesc') {
        return (b.institution_value || 0) - (a.institution_value || 0)
      } else if (sort === 'nameAsc') {
        return (a.security.name || 'z').localeCompare(b.security.name || 'z')
      } else if (sort === 'nameDesc') {
        return (b.security.name || 'a').localeCompare(a.security.name || 'a')
      } else {
        return 0
      }
    });

    setHoldings(newHoldings)
  }, [pinnedHoldings, sort])

  return (
    <Box
      backgroundColor='modalBox100'
      borderColor='modalBorder'
      borderWidth={1}
      style={styles.modalBackground}>
      <Box variant='dragBarContainer'>
        <Box variant='dragBar' />
      </Box>
      <Box
        paddingHorizontal='pagePadding'
        style={styles.header}
      >
        <Header2>Holdings</Header2>
      </Box>
      <Box style={styles.headerSeperator}>
        <Seperator backgroundColor='modalSeperator' />
      </Box>
      <Box
        paddingHorizontal='pagePadding'
        style={styles.tableHeader}>
        <Button
          label={'Name'}
          onPress={() => setSort(sort === 'nameAsc' ? 'nameDesc' : sort === 'nameDesc' ? 'default' : 'nameAsc')}
          fontSize={15}
          labelPlacement='left'
          textColor={['nameAsc', 'nameDesc'].includes(sort) ? 'mainText' : 'tertiaryText'}
          icon={
            <Icon
              size={15}
              strokeWidth={2}
              icon={sort === 'nameAsc' ? ArrowUp : ArrowDown}
              color={['nameAsc', 'nameDesc'].includes(sort) ? 'mainText' : 'tertiaryText'}
            />}
        />
        <Button
          label={'Value'}
          onPress={() => setSort(sort === 'amountDesc' ? 'amountAsc' : sort === 'amountAsc' ? 'default' : 'amountDesc')}
          fontSize={15}
          labelPlacement='left'
          textColor={['amountAsc', 'amountDesc'].includes(sort) ? 'mainText' : 'tertiaryText'}
          icon={
            <Icon
              size={15}
              strokeWidth={2}
              icon={sort === 'amountAsc' ? ArrowUp : ArrowDown}
              color={['amountAsc', 'amountDesc'].includes(sort) ? 'mainText' : 'tertiaryText'}
            />}
        />
      </Box>
      <CustomScrollView>
        {holdings?.map((holding, index) => (
          <Row key={holding.security_id} holding={holding} account={holding.account} index={index} />
        ))}
      </CustomScrollView>
    </Box>
  )
}

export default AccountPicker
