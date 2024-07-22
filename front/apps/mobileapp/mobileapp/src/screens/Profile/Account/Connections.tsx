import { View } from 'react-native';

import styles from './styles/connections'
import { Box, Text, Seperator, BoxHeader, ChevronTouchable } from '@ledget/native-ui';
import { useGetPlaidItemsQuery } from '@ledget/shared-features';

const Household = () => {
  const { data: plaidItems } = useGetPlaidItemsQuery()

  return (
    <>
      <BoxHeader>Connections</BoxHeader>
      <Box variant='nestedContainer' backgroundColor='nestedContainer'>
        {plaidItems?.map((item, i) => (
          <View style={styles.row}>
            <ChevronTouchable>
              <Text>{item.institution.name}</Text>
            </ChevronTouchable>
            {(i !== plaidItems.length - 1) && <Seperator variant='bare' />}
          </View>
        ))}
      </Box>
    </>
  )
}

export default Household
