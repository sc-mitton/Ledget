import { useMemo, useLayoutEffect, useEffect } from 'react';
import { View, ScrollView } from 'react-native'

import styles from './styles/screen';
import { Box, DollarCents } from '@ledget/native-ui'
import { useGetAccountsQuery } from '@ledget/shared-features';
import type { AccountsScreenProps } from '@types'
import InfoBox from './InfoBox';
import BudgetItemsBox from './BudgetItemsBox';
import Notes from './Notes';
import Menu from './Menu';
import TransactionName from './TransactionName';

const Transaction = (props: AccountsScreenProps<'Transaction'>) => {
  const { data: accountsData } = useGetAccountsQuery();

  const account = useMemo(() => {
    return accountsData?.accounts.find(account => account.account_id === props.route.params.transaction.account)
  }, [accountsData, props.route.params.transaction.account])

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => <Menu {...props} />
    })
  }, [account])

  return (
    <>
      <Box variant='nestedScreen'>
        {account &&
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <DollarCents
                value={props.route.params.transaction.amount}
                fontSize={44}
              />
              <TransactionName {...props} />
            </View>
            <InfoBox item={props.route.params.transaction} account={account} />
            {(props.route.params.transaction.categories ||
              props.route.params.transaction.bill ||
              props.route.params.transaction.predicted_bill ||
              props.route.params.transaction.predicted_category) &&
              <BudgetItemsBox item={props.route.params.transaction} {...props} />}
            <Notes transaction={props.route.params.transaction} />
          </ScrollView>
        }
      </Box>
    </>
  )
}

export default Transaction
