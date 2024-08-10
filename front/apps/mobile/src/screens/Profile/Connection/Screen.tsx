import { useEffect, useMemo } from 'react';
import { View, TouchableOpacity, Linking, ScrollView } from 'react-native';

import {
  Header,
  InstitutionLogo,
  Box,
  Text,
  Button,
  Icon,
} from '@ledget/native-ui';
import { Trash2 } from 'geist-native-icons';
import { ConnectionScreenProps } from '@types';
import { setModal } from '@features/modalSlice';
import { useAppDispatch } from '@/hooks';
import { useGetPlaidItemsQuery, useGetMeQuery, apiSlice } from '@ledget/shared-features';

import styles from './styles';

const Screen = ({ navigation, route }: ConnectionScreenProps) => {
  const { data: plaidItems } = useGetPlaidItemsQuery();
  const { data: user } = useGetMeQuery();
  const dispatch = useAppDispatch();

  const accounts = useMemo(() => {
    return plaidItems?.find((item) => item.id === route.params.item)?.accounts;
  }, [plaidItems, route.params.item]);

  return (
    <Box variant='screenWithHeader'>
      <ScrollView style={styles.screen}>
        <TouchableOpacity
          style={styles.headerContainer}
          activeOpacity={.8}
          onPress={() => { Linking.openURL(plaidItems?.find((item) => item.id === route.params.item)?.institution?.url || '') }}>
          <View style={styles.header}>
            <InstitutionLogo data={plaidItems?.find((item) => item.id === route.params.item)?.institution?.logo} />
            <Header>
              {plaidItems?.find((item) => item.id === route.params.item)?.institution?.name}
            </Header>
          </View>
        </TouchableOpacity>
        <Box variant='nestedContainer' style={styles.accountsBox}>
          <View style={styles.accounts}>
            <View>
              {accounts?.map((account, i) => (
                <Box
                  style={styles.cell}
                  borderBottomWidth={1}
                  borderBottomColor={i !== accounts?.length - 1 ? 'lightseperator' : 'transparent'}
                >
                  <Text>{account.name?.length || 0 > 20 ? `${account.name?.slice(0, 20)}...` : account.name}</Text>
                </Box>))}
            </View>
            <View style={styles.maskColumn}>
              {accounts?.map((account, i) => (
                <Box
                  borderBottomColor={i !== accounts?.length - 1 ? 'lightseperator' : 'transparent'}
                  borderBottomWidth={1}
                  style={[styles.cell, styles.maskCell]}
                >
                  <Text color='secondaryText' fontSize={14}>&#8226;&nbsp;&#8226;&nbsp;</Text>
                  <Text color='secondaryText' fontSize={14}>{account.mask}</Text>
                </Box>))}
            </View>
            <View>
              {accounts?.map((account, i) => (
                <Box
                  style={[styles.cell, styles.typeCell]}
                  borderBottomWidth={1}
                  borderBottomColor={i !== accounts?.length - 1 ? 'lightseperator' : 'transparent'}
                >
                  <Text color='secondaryText' fontSize={14}>{account.type}</Text>
                </Box>))}
            </View>
          </View>
        </Box>
        {plaidItems?.find((item) => item.id === route.params.item)?.user === user?.id &&
          <View style={styles.buttons}>
            <Button
              style={styles.button}
              variant='grayMain'
              label='Disconnect'
              labelPlacement='left'
              onPress={() => dispatch(setModal({
                name: 'confirmDeletePlaidItem',
                args: { id: route.params.item }
              }))}
            >
              <Icon icon={Trash2} size={18} />
            </Button>
          </View>
        }
      </ScrollView>
    </Box>
  )
}

export default Screen
