import { useMemo } from 'react';
import { View, TouchableOpacity, Linking } from 'react-native';

import {
  Header,
  Base64Image,
  Box,
  Text,
  Button,
  Icon,
} from '@ledget/native-ui';
import { Trash2 } from 'geist-native-icons';
import { ConnectionScreenProps } from '@types';
import { useGetPlaidItemsQuery } from '@ledget/shared-features';

import styles from './styles';

const Screen = ({ navigation, route }: ConnectionScreenProps) => {
  const { data: plaidItems } = useGetPlaidItemsQuery();

  const accounts = useMemo(() => {
    return plaidItems?.find((item) => item.id === route.params.item)?.accounts;
  }, [plaidItems, route.params.item]);

  return (
    <Box variant='screenWithHeader'>
      <TouchableOpacity
        style={styles.headerContainer}
        activeOpacity={.8}
        onPress={() => { Linking.openURL(plaidItems?.find((item) => item.id === route.params.item)?.institution.url || '') }}>
        <View style={styles.header}>
          <Base64Image data={plaidItems?.find((item) => item.id === route.params.item)?.institution.logo} />
          <Header>
            {plaidItems?.find((item) => item.id === route.params.item)?.institution.name}
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
                <Text>{account.name}</Text>
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
      <View style={styles.buttons}>
        <Button
          style={styles.button}
          variant='grayMain'
          label='Disconnect'
          labelPlacement='left'
        >
          <Icon icon={Trash2} size={18} />
        </Button>
      </View>
    </Box>
  )
}

export default Screen
