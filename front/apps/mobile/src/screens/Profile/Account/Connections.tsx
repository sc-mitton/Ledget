import { View, TouchableOpacity } from 'react-native';
import { Plus } from 'geist-native-icons';

import styles from './styles/connections'
import { ShimmerBox, Text, Seperator, BoxHeader, ChevronTouchable, Icon, InstitutionLogo } from '@ledget/native-ui';
import { useGetPlaidItemsQuery } from '@ledget/shared-features';
import { ProfileScreenProps } from '@types';
import { usePlaidLink } from '@hooks';

const Connections = (props: ProfileScreenProps) => {
  const { data: plaidItems, isLoading } = useGetPlaidItemsQuery()
  const { openLink } = usePlaidLink()

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
                <InstitutionLogo data={item.institution?.logo} />
                <Text>{item.institution?.name}</Text>
              </ChevronTouchable>
            </View>
            <Seperator variant='bare' />
          </>
        ))}
        <View style={styles.row}>
          <TouchableOpacity
            onPress={openLink}
            activeOpacity={0.7}
            style={styles.addButton}>
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
