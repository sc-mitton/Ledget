import { View, TouchableOpacity } from 'react-native';
import { Plus } from 'geist-native-icons';

import styles from './styles/connections'
import { ShimmerBox, Text, Seperator, BoxHeader, ChevronTouchable, Icon } from '@ledget/native-ui';
import { useGetPlaidItemsQuery } from '@ledget/shared-features';
import { ProfileScreenProps } from '@types';

const Connections = (props: ProfileScreenProps) => {
  const { data: plaidItems, isLoading } = useGetPlaidItemsQuery()

  return (
    <>
      <BoxHeader>Connections</BoxHeader>
      <ShimmerBox
        shimmering={isLoading}
        numberOfLines={4}
        variant='nestedContainer'
        backgroundColor='nestedContainer'
        style={styles.container}
      >
        {plaidItems?.map((item, i) => (
          <>
            <View style={styles.row} key={item.id}>
              <ChevronTouchable onPress={() => props.navigation.navigate('Connection', { item: item.id })}>
                <Text>{item.institution.name}</Text>
              </ChevronTouchable>
            </View>
            <Seperator variant='bare' />
          </>
        ))}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => console.log('add connection')}>
            <Text>Add Connection</Text>
            <View style={styles.iconContainer}>
              <Icon icon={Plus} color='quinaryText' />
            </View>
          </TouchableOpacity>
        </View>
      </ShimmerBox>
    </>
  )
}

export default Connections
