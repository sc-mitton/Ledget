import { View } from 'react-native';

import styles from './styles/connections'
import { Box, Text, Seperator, BoxHeader, ChevronTouchable } from '@ledget/native-ui';
import { useGetPlaidItemsQuery } from '@ledget/shared-features';
import { ProfileScreenProps } from '@types';

const Connections = (props: ProfileScreenProps) => {
  const { data: plaidItems } = useGetPlaidItemsQuery()

  return (
    <>
      <BoxHeader>Connections</BoxHeader>
      <Box variant='nestedContainer' backgroundColor='nestedContainer'>
        {plaidItems?.map((item, i) => (
          <View style={styles.row} key={item.id}>
            <ChevronTouchable onPress={() => props.navigation.navigate('Connection', { item: item.id })}>
              <Text>{item.institution.name}</Text>
            </ChevronTouchable>
            {(i !== plaidItems.length - 1) && <Seperator variant='bare' />}
          </View>
        ))}
      </Box>
    </>
  )
}

export default Connections
