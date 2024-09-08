import { useRef } from 'react';
import { TouchableOpacity, View } from 'react-native'

import styles from './styles/screen';
import { Text, Box, BoxHeader, BillCatLabel } from '@ledget/native-ui'
import { useConfirmTransactionsMutation, useUpdateTransactionMutation } from '@ledget/shared-features';
import { BillCatSelect } from '@components';
import { isCategory, isBill } from '@ledget/shared-features';
import type { AccountsScreenProps } from '@types'
import type { Transaction as TransactionT } from '@ledget/shared-features';

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
              <TouchableOpacity onPress={() => props.navigation.navigate('Split', { transaction: props.item })}>
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
              modalPickerHeader='Update Category or Bill'
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

export default BudgetItemsBox;
