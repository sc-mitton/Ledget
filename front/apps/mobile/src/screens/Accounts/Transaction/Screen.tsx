import { useMemo, useState, useRef } from 'react';
import { TouchableOpacity, View } from 'react-native'
import dayjs from 'dayjs';

import styles from './styles/transaction';
import { Text, Box, Header2, InstitutionLogo, BoxHeader, BillCatLabel } from '@ledget/native-ui'
import { useGetAccountsQuery, useConfirmTransactionsMutation, updateTransaction, useUpdateTransactionMutation } from '@ledget/shared-features';
import { BillCatSelect } from '@components';
import { isCategory, isBill } from '@ledget/shared-features';
import type { AccountsScreenProps } from '@types'
import type { Transaction as TransactionT, Account as AccountT } from '@ledget/shared-features';

const InfoBox = (props: { item: TransactionT, account: AccountT }) => {

  return (
    <>
      <BoxHeader>Details</BoxHeader>
      <Box variant='nestedContainer'>
        <View style={[styles.tableLabels, styles.tableColumn]}>
          <Text color='tertiaryText'>Account</Text>
          <Text color='tertiaryText'>Amount</Text>
          <Text color='tertiaryText'>Date</Text>
          {props.item.merchant_name &&
            <Text color='tertiaryText'>Merchant</Text>}
          {(props.item.address || props.item.city || props.item.region) &&
            <>
              <Text color='tertiaryText'>Location</Text>
              <Text color='transparent'>Address</Text>
            </>}
        </View>
        <View style={[styles.tableColumn]}>
          <View style={styles.accountData}>
            <InstitutionLogo account={props.item.account} size={20} />
            <Text>{props.account?.name}</Text>
            <Text color='secondaryText' fontSize={15}>
              &bull;&nbsp;&bull;&nbsp;{props.account?.mask}
            </Text>
          </View>
          <Text color={props.item.amount < 0 ? 'greenText' : 'mainText'}>
            {props.item.amount < 0 ? '-$' : '$'}
            {Math.abs(props.item.amount).toFixed(2)}
          </Text>
          <Text>{dayjs(props.item.date).format('MMM D, YYYY')}</Text>
          {props.item.merchant_name &&
            <Text>{props.item.merchant_name}</Text>}
          {(props.item.address || props.item.city || props.item.region) &&
            <>
              <Text>{props.item.city}, {props.item.region}</Text>
              <Text>{props.item.address}</Text>
            </>}
        </View>
      </Box>
    </>
  )
}

const BudgetItemsBox = (props: { item: TransactionT } & AccountsScreenProps<'Transaction'>) => {
  const [confirmTransactions] = useConfirmTransactionsMutation();
  const [updateTransaction] = useUpdateTransactionMutation();
  const items = useRef(
    props.item.categories?.length
      ? props.item.categories : props.item.bill || props.item.predicted_bill || props.item.predicted_category).current

  return (
    <>
      <BoxHeader>Budget</BoxHeader>
      <Box variant='nestedContainer'>
        <View style={[styles.tableLabels, styles.tableColumn]}>
          {Array.isArray(items)
            ? <Text color='tertiaryText'>Categories</Text>
            : isCategory(items)
              ? <Text color='tertiaryText'>Category</Text>
              : <Text color='tertiaryText'>Bill</Text>}
        </View>
        <View style={[styles.budgetItemsContainer]}>
          {Array.isArray(items)
            ?
            items.map((c, index) => (
              <TouchableOpacity onPress={() => props.navigation.navigate('SplitTransaction', { transaction: props.item })}>
                <BillCatLabel
                  key={index}
                  name={c.name}
                  emoji={c.emoji}
                  period={c.period}
                />
              </TouchableOpacity>))
            :
            <BillCatSelect
              items='all'
              multiple={false}
              modalPickerHeader='Update'
              onClose={(value) => {
                if (value && value.value !== items?.id) {
                  confirmTransactions([
                    {
                      transaction_id: props.item.transaction_id,
                      ...(value.group === 'category'
                        ? { splits: [{ category: value.value, fraction: 1 }] }
                        : { bill: value.value })
                    }])
                } else {
                  updateTransaction({
                    transactionId: props.item.transaction_id,
                    data: { is_spend: false }
                  })
                }
              }}
              defaultValue={{
                label: items?.name || '',
                value: items?.id || '',
                emoji: items?.emoji || '',
                period: items?.period || 'month',
                group: isCategory(items) ? 'category' : 'bill'
              }}
              isFormInput={false}
              {...(isCategory(items) || isBill(items) ? {
                value: items.id,
                emoji: items.emoji,
                period: items.period,
                name: items.name
              } : {})}
            />}
        </View>
      </Box>
    </>
  )
}

const Transaction = (props: AccountsScreenProps<'Transaction'>) => {
  const { data: accountsData } = useGetAccountsQuery();

  const account = useMemo(() => {
    return accountsData?.accounts.find(account => account.account_id === props.route.params.transaction.account)
  }, [accountsData, props.route.params.transaction.account])

  return (
    <Box variant='nestedScreen'>
      {account &&
        <>
          <View style={styles.header}>
            <Header2>{props.route.params.transaction.name}</Header2>
          </View>
          {(props.route.params.transaction.categories ||
            props.route.params.transaction.bill ||
            props.route.params.transaction.predicted_bill ||
            props.route.params.transaction.predicted_category) &&
            <BudgetItemsBox item={props.route.params.transaction} {...props} />}
          <InfoBox item={props.route.params.transaction} account={account} />
        </>
      }
    </Box>
  )
}

export default Transaction
