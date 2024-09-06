import { useMemo, useLayoutEffect } from 'react';
import { View } from 'react-native'

import styles from './styles/screen';
import { Box, Text, DollarCents } from '@ledget/native-ui'
import { useGetAccountsQuery } from '@ledget/shared-features';
import type { AccountsScreenProps } from '@types'
import InfoBox from './InfoBox';
import BudgetItemsBox from './BudgetItemsBox';
import Notes from './Notes';
import Menu from './Menu';

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
          <>
            <View style={styles.header}>
              <DollarCents
                value={props.route.params.transaction.amount}
                fontSize={36} />
              <Text>{props.route.params.transaction.name}</Text>
            </View>
            {(props.route.params.transaction.categories ||
              props.route.params.transaction.bill ||
              props.route.params.transaction.predicted_bill ||
              props.route.params.transaction.predicted_category) &&
              <BudgetItemsBox item={props.route.params.transaction} {...props} />}
            <InfoBox item={props.route.params.transaction} account={account} />
            <Notes transaction={props.route.params.transaction} />
          </>
        }
      </Box>
    </>
  )
}

export default Transaction
