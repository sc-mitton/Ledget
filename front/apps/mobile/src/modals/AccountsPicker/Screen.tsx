import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '@shopify/restyle';
import DraggableFlatList, { ScaleDecorator, RenderItemParams, DragEndParams } from 'react-native-draggable-flatlist';
import * as Haptics from 'expo-haptics';

import styles from './styles/screen';
import { AccountsScreenProps } from '@types';
import { Box, Header2 } from '@ledget/native-ui';
import { useUpdateAccountsMutation } from '@ledget/shared-features';
import type { Account } from '@ledget/shared-features';
import Filters from './Filters';
import AccountRow from './AccountRow';
import TableHeaders from './Headers';

const AccountPicker = (props: AccountsScreenProps<'PickAccount'>) => {
  const [updateOrder] = useUpdateAccountsMutation();
  const theme = useTheme();
  const [isFiltered, setIsFiltered] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>();

  const handleEndDrag = (args: DragEndParams<Account>) => {
    // If order of accounts has changed, update the order in the database

    if (args.data.map((item, index) => item.account_id !== accounts?.[index].account_id).includes(true)) {
      updateOrder(args.data.map((item, index) => ({
        account: item.account_id,
        order: index
      })));
    }
  }

  return (
    <Box
      backgroundColor='modalBox100'
      borderColor='modalBorder'
      borderWidth={1}
      style={styles.modalBackground}>
      <Box variant='dragBarContainer'>
        <Box variant='dragBar' />
      </Box>
      <View style={styles.header}>
        <Header2>
          {`${props.route.params.options?.title || 'Accounts'}`}
        </Header2>
      </View>
      <Filters onChange={setAccounts} onFiltered={setIsFiltered} {...props} />
      <TableHeaders {...props} />
      <View style={styles.accountsListContainer}>
        <Box style={[styles.accountsList, { bottom: theme.spacing.navHeight + 24 }]}>
          {accounts &&
            <DraggableFlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.draggableListContent}
              debug={false}
              onDragEnd={handleEndDrag}
              keyExtractor={item => item.account_id}
              data={accounts.filter(a => a.type === props.route.params.accountType)}
              renderItem={(args: RenderItemParams<Account>) => (
                <>
                  <ScaleDecorator activeScale={1.03}>
                    <AccountRow
                      index={args.getIndex() || 0}
                      draggable={!isFiltered}
                      isSelected={args.item.account_id === props.route.params.currentAccount}
                      detailedView={args.isActive}
                      onLongPress={() => {
                        Haptics.selectionAsync();
                        args.drag();
                      }}
                      onPress={() => {
                        props.navigation.navigate(
                          'Accounts', {
                          screen: 'AccountsTabs',
                          params: {
                            screen: 'Depository',
                            params: { account: args.item }
                          }
                        }
                        )
                      }}
                      last={args.getIndex() === accounts.length - 1}
                      account={args.item}
                      selected={args.item.account_id === props.route.params.currentAccount}
                    />
                  </ScaleDecorator>
                </>
              )}
            />
          }
        </Box>
      </View>
    </Box>
  )
}

export default AccountPicker
