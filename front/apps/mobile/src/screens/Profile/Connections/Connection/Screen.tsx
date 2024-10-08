import { useEffect, useMemo, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { usePlaidLink } from '@hooks';
import * as WebBrowser from 'expo-web-browser';

import {
  InstitutionLogo,
  Box,
  Text,
  Icon,
  Button
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
    if (plaidItem?.login_required || plaidItem?.pending_expiration) {
      setSkip(false);
    }
  }, [plaidItem]);

  return (
    <Box variant='nestedScreen'>
      <Button
        style={styles.headerContainer}
        labelPlacement='left'
        fontSize={26}
        lineHeight={36}
        variant='bold'
        label={plaidItems?.find((item) => item.id === route.params.item)?.institution?.name}
        onPress={() => { WebBrowser.openBrowserAsync(plaidItems?.find((item) => item.id === route.params.item)?.institution?.url || '') }}
      >
        <View style={styles.logo}>
          <InstitutionLogo data={plaidItems?.find((item) => item.id === route.params.item)?.institution?.logo} />
        </View>
      </Button>
      <Box variant='nestedContainer' style={styles.accountsBox}>
        <ScrollView>
          <View style={styles.accounts}>
            <View>
              {plaidItem?.accounts?.map((account, i) => (
                <Box
                  key={`${account.id}name`}
                  style={styles.cell}
                  borderBottomWidth={1}
                  borderBottomColor={i !== plaidItem?.accounts?.length - 1 ? 'nestedContainerSeperator' : 'transparent'}
                >
                  <Text>{account.name?.length || 0 > 20 ? `${account.name?.slice(0, 20)}...` : account.name}</Text>
                </Box>))}
            </View>
            <View style={styles.maskColumn}>
              {plaidItem?.accounts?.map((account, i) => (
                <Box
                  key={`${account.id}mask`}
                  borderBottomColor={i !== plaidItem?.accounts?.length - 1 ? 'nestedContainerSeperator' : 'transparent'}
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
                  borderBottomColor={i !== plaidItem?.accounts?.length - 1 ? 'nestedContainerSeperator' : 'transparent'}
                >
                  <Text color='secondaryText' fontSize={14}>{account.type}</Text>
                </Box>))}
            </View>
          </View>
        </ScrollView>
      </Box>
      {plaidItem?.user === user?.id &&
        <View style={styles.buttons}>
          <Button
            style={styles.button}
            onPress={() => {
              navigation.navigate('Modals', {
                screen: 'ConfirmDeletePlaidItem',
                params: {
                  id: route.params.item
                }
              })
            }}
            textColor='blueText'
            label='Disconnect'
            labelPlacement='right'
            icon={<Icon color='blueText' icon={Trash2} size={18} />}
          />
          {(plaidItem?.login_required || plaidItem?.pending_expiration) &&
            <Button
              style={styles.button}
              textColor='blueText'
              onPress={openLink}
              label='Reconnect'
              labelPlacement='right'
              icon={<Icon color='blueText' icon={Repeat} size={18} />}
            />}
        </View>
      }
    </Box>
  )
}

export default Screen
