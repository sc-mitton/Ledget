import React, { useMemo, useLayoutEffect, useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';

import styles from './styles/screen';
import { Box, DollarCents } from '@ledget/native-ui';
import {
  useGetAccountsQuery,
  useLazyGetTransactionsQuery,
  Transaction as TransactionT,
} from '@ledget/shared-features';
import { BackHeader } from '@ledget/native-ui';
import type { RootStackScreenProps } from '@types';
import InfoBox from './InfoBox';
import BudgetItemsBox from './BudgetItemsBox';
import Notes from './Notes';
import Menu from './Menu';
import TransactionName from './TransactionName';

const Transaction = (props: RootStackScreenProps<'Transaction'>) => {
  const [transaction, setTransaction] = useState<TransactionT>();
  const [fetchTransaction, { data: transactionData }] =
    useLazyGetTransactionsQuery();
  const { data: accountsData } = useGetAccountsQuery();

  useEffect(() => {
    if (transactionData) {
      setTransaction(transactionData.results[0]);
    }
  }, [transactionData]);

  useEffect(() => {
    if (typeof props.route.params.transaction === 'string') {
      fetchTransaction({
        id: props.route.params.transaction,
      });
    } else {
      setTransaction(props.route.params.transaction);
    }
  }, [props.route.params.transaction]);

  const account = useMemo(() => {
    return accountsData?.accounts.find(
      (account) => account.id === transaction?.account
    );
  }, [accountsData, transaction?.account]);

  useLayoutEffect(() => {
    if (!transaction) return;
    props.navigation.setOptions({
      headerRight: () => <Menu {...props} transaction={transaction} />,
    });
    if (props.route.params.options?.asModal) {
      props.navigation.setOptions({
        header: (props) => <BackHeader {...props} top={36} height={0} />,
      });
    }
  }, [account]);

  return (
    <>
      <Box
        variant={
          props.route.params.options?.asModal ? 'screen' : 'nestedScreen'
        }
        flex={1}
        borderRadius="xl"
        backgroundColor={
          props.route.params.options?.asModal ? 'modalBox' : 'mainBackground'
        }
      >
        {account && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <DollarCents
                variant="bold"
                value={transaction?.amount || 0}
                fontSize={36}
              />
              {transaction && (
                <TransactionName {...props} transaction={transaction} />
              )}
            </View>
            <InfoBox
              item={transaction}
              account={account}
              isInModal={props.route.params.options?.asModal}
            />
            {(transaction?.categories ||
              transaction?.bill ||
              transaction?.predicted_bill ||
              transaction?.predicted_category) && (
              <BudgetItemsBox
                item={transaction}
                {...props}
                isInModal={props.route.params.options?.asModal}
              />
            )}
            {transaction && (
              <Notes
                transaction={transaction}
                isInModal={props.route.params.options?.asModal}
              />
            )}
          </ScrollView>
        )}
      </Box>
    </>
  );
};

export default Transaction;
