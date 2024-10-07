import { useState } from 'react';
import { View } from 'react-native';

import styles from './styles/edit-bill-cats';
import { BudgetScreenProps } from '@types';
import { Box, TabsTrack, Text } from '@ledget/native-ui';
import Bills from './Bills';

const EditBillCats = (props: BudgetScreenProps<'EditBills'>) => {
  const [pageIndex, setPageIndex] = useState(0)

  return (
    <Box variant='nestedScreen' style={styles.container}>
      <View style={styles.tabsTrack}>
        <TabsTrack onIndexChange={setPageIndex} containerStyle={styles.tabsTrackContent}>
          <TabsTrack.Tab index={0}>
            {({ selected }) => (
              <Text color={selected ? 'mainText' : 'tertiaryText'}>Monthly</Text>
            )}
          </TabsTrack.Tab>
          <TabsTrack.Tab index={1}>
            {({ selected }) => (
              <Text color={selected ? 'mainText' : 'tertiaryText'}>Yearly</Text>
            )}
          </TabsTrack.Tab>
          <TabsTrack.Tab index={2}>
            {({ selected }) => (
              <Text color={selected ? 'mainText' : 'tertiaryText'}>Once</Text>
            )}
          </TabsTrack.Tab>
        </TabsTrack>
      </View>
      <Box
        backgroundColor='nestedContainer'
        borderRadius='l'
        paddingVertical='m'
        marginBottom='navHeight'
        style={styles.nestedContainer}
      >
        <Bills
          {...props}
          period={pageIndex === 0 ? 'month'
            : pageIndex === 1 ? 'year'
              : 'once'}
        />
      </Box>
    </Box>
  )
}
export default EditBillCats
