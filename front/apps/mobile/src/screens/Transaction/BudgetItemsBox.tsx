import React, { useRef } from 'react';
import { TouchableOpacity, View } from 'react-native'
import Animated, { LinearTransition } from 'react-native-reanimated';

import styles from './styles/screen';
import { Text, Box, BoxHeader, BillCatLabel } from '@ledget/native-ui'
import { useConfirmTransactionsMutation, useUpdateTransactionMutation } from '@ledget/shared-features';
import { BillCatSelect } from '@components';
import { isCategory, isBill } from '@ledget/shared-features';
import type { RootStackScreenProps } from '@types'
import type { Transaction as TransactionT } from '@ledget/shared-features';

interface Props extends RootStackScreenProps<'Transaction'> {
  item: TransactionT
  isInModal?: boolean
}

const BudgetItemsBox = (props: Props) => {
  const [confirmTransactions] = useConfirmTransactionsMutation();
  const [updateTransaction] = useUpdateTransactionMutation();
  const items = props.item.categories?.length
    ? props.item.categories : props.item.bill || props.item.predicted_bill || props.item.predicted_category

  return (
    <Animated.View layout={LinearTransition}>
      {items &&
        <>
          <View style={[styles.tableLabels, styles.tableColumn]}>
            {Array.isArray(items)
              ? <BoxHeader>Categories</BoxHeader>
              : isCategory(items)
                ? <BoxHeader>Category</BoxHeader>
                : <BoxHeader>Bill</BoxHeader>}
          </View>
          <Box
            variant='nestedContainer'
            backgroundColor={props.isInModal ? 'modalSeperator' : undefined}
          >
            <View style={[styles.budgetItemsContainer]}>
              {Array.isArray(items)
                ?
                items.map((c, index) => (
                  <TouchableOpacity onPress={() => props.navigation.navigate('Modals', { screen: 'Split', params: { transaction: props.item } })}>
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
                        data: { detail: null }
                      })
                    }
                  }}
                  defaultValue={items?.id}
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
      }
    </Animated.View>
  )
}

export default BudgetItemsBox;
