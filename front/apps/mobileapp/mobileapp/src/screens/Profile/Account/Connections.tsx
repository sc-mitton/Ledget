import { View } from 'react-native';

import styles from './styles/connections'
import { Box, Text, Seperator, BoxHeader } from '@ledget/native-ui';
import { useGetPlaidItemsQuery } from '@ledget/shared-features';
import { ChevronRightButton } from './shared';

const Household = () => {
  const { data: plaidItems } = useGetPlaidItemsQuery()

  return (
    <>
      <BoxHeader>Connections</BoxHeader>
      <Box variant='nestedContainer' backgroundColor='nestedContainer'>
        {plaidItems?.map((item, i) => (
          <View style={styles.row}>
            <View style={styles.institution}>
              <Text>{item.institution.name}</Text>
              <ChevronRightButton onPress={() => console.log('edit')} />
            </View>
            {(i !== plaidItems.length - 1) && <Seperator variant='bare' />}
          </View>
        ))}
      </Box>
    </>
  )
}

export default Household
