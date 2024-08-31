import { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { usePlaidLink } from '@hooks';
import * as WebBrowser from 'expo-web-browser';

import {
  Header,
  InstitutionLogo,
  Box,
  Text,
  Icon,
} from '@ledget/native-ui';
import { Trash2, Repeat } from 'geist-native-icons';
import { ConnectionsScreenProps } from '@types';
import { useGetPlaidItemsQuery, useGetMeQuery } from '@ledget/shared-features';

import styles from './styles';

const Screen = ({ navigation, route }: ConnectionsScreenProps<'Connection'>) => {
  const { data: plaidItems } = useGetPlaidItemsQuery();
  const { data: user } = useGetMeQuery();
  const [skip, setSkip] = useState(true);
  const { openLink } = usePlaidLink({ itemId: route.params.item, skip });

  const plaidItem = useMemo(() => {
    return plaidItems?.find((item) => item.id === route.params.item);
  }, [plaidItems, route.params.item]);

  useEffect(() => {
    if (plaidItem?.login_required) {
      setSkip(false);
    }
  }, [plaidItem]);

  return (
    <Box variant='screenWithHeader'>
      <TouchableOpacity
        style={styles.headerContainer}
        activeOpacity={.8}
        onPress={() => { WebBrowser.openBrowserAsync(plaidItems?.find((item) => item.id === route.params.item)?.institution?.url || '') }}>
        <View style={styles.header}>
          <InstitutionLogo data={plaidItems?.find((item) => item.id === route.params.item)?.institution?.logo} />
          <Header>
            {plaidItems?.find((item) => item.id === route.params.item)?.institution?.name}
          </Header>
        </View>
      </TouchableOpacity>
      <Box variant='nestedContainer' style={styles.accountsBox}>
        <ScrollView>
          <View style={styles.accounts}>
            <View>
              {plaidItem?.accounts?.map((account, i) => (
                <Box
                  key={`${account.id}name`}
                  style={styles.cell}
                  borderBottomWidth={1}
                  borderBottomColor={i !== plaidItem?.accounts?.length - 1 ? 'lightseperator' : 'transparent'}
                >
                  <Text>{account.name?.length || 0 > 20 ? `${account.name?.slice(0, 20)}...` : account.name}</Text>
                </Box>))}
            </View>
            <View style={styles.maskColumn}>
              {plaidItem?.accounts?.map((account, i) => (
                <Box
                  key={`${account.id}mask`}
                  borderBottomColor={i !== plaidItem?.accounts?.length - 1 ? 'lightseperator' : 'transparent'}
                  borderBottomWidth={1}
                  style={[styles.cell, styles.maskCell]}
                >
                  <Text color='secondaryText' fontSize={14}>&#8226;&nbsp;&#8226;&nbsp;</Text>
                  <Text color='secondaryText' fontSize={14}>{account.mask}</Text>
                </Box>))}
            </View>
            <View>
              {plaidItem?.accounts?.map((account, i) => (
                <Box
                  key={`${account.id}type`}
                  style={[styles.cell, styles.typeCell]}
                  borderBottomWidth={1}
                  borderBottomColor={i !== plaidItem?.accounts?.length - 1 ? 'lightseperator' : 'transparent'}
                >
                  <Text color='secondaryText' fontSize={14}>{account.type}</Text>
                </Box>))}
            </View>
          </View>
        </ScrollView>
      </Box>
      {plaidItem?.user === user?.id &&
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('Modals', {
                screen: 'ConfirmDeletePlaidItem',
                params: {
                  id: route.params.item
                }
              })
            }}
          >
            <Icon color='blueText' icon={Trash2} size={18} />
            <Text color='blueText'>Disconnect</Text>
          </TouchableOpacity>
          {plaidItem?.login_required &&
            <TouchableOpacity style={styles.button} onPress={openLink}>
              <Icon color='blueText' icon={Repeat} size={18} />
              <Text color='blueText'>Reconnect</Text>
            </TouchableOpacity>}
        </View>
      }
    </Box>
  )
}

export default Screen
