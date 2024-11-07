import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '@shopify/restyle';
import DraggableFlatList, { ScaleDecorator, DragEndParams } from 'react-native-draggable-flatlist';
import * as Haptics from 'expo-haptics';

import styles from './styles/screen';
import { ModalScreenProps } from '@types';
import { Box, Header2 } from '@ledget/native-ui';
import { useGetAccountsQuery, useUpdateAccountsMutation } from '@ledget/shared-features';
import type { Account } from '@ledget/shared-features';
import Filters from './Filters';
import AccountRow from './AccountRow';
import TableHeaders from './Headers';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { selectAccountsTabDepositAccounts, setAccountsTabDepositAccounts } from '@/features/uiSlice';

const AccountPicker = (props: ModalScreenProps<'PickAccount'>) => {
  const dispatch = useAppDispatch();

  const [updateOrder] = useUpdateAccountsMutation();
  const theme = useTheme();
  const [isFiltered, setIsFiltered] = useState(false);

  const [accounts, setAccounts] = useState<Account[]>();
  const { data: accountsData } = useGetAccountsQuery();
  const globalAccounts = useAppSelector(selectAccountsTabDepositAccounts, () => true);

  const handleEndDrag = (args: DragEndParams<Account>) => {
    // If order of accounts has changed, update the order in the database

    if (args.data.map((item, index) => item.id !== accounts?.[index].id).includes(true)) {
      updateOrder(args.data.map((item, index) => ({
        account: item.id,
        order: index
      })));
      setAccounts(args.data);
    }
  }

  useEffect(() => {
    setAccounts(accountsData?.accounts.filter(a => a.type === props.route.params.accountType));
  }, [accountsData]);

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
              keyExtractor={item => item.id}
              data={accounts}
              renderItem={(args) => (
                <>
                  <ScaleDecorator activeScale={1.03}>
                    <AccountRow
                      index={args.getIndex() || 0}
                      draggable={!isFiltered}
                      isSelected={globalAccounts?.some(a => a.id === args.item.id)}
                      detailedView={args.isActive}
                      onLongPress={() => {
                        Haptics.selectionAsync();
                        args.drag();
                      }}
                      onPress={() => {
                        dispatch(setAccountsTabDepositAccounts([args.item]));
                        props.navigation.goBack();
                      }}
                      last={args.getIndex() === accounts.length - 1}
                      account={args.item}
                      selected={globalAccounts?.some(a => a.id === args.item.id)}
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
